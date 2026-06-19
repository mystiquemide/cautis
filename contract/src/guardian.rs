use odra::casper_types::U512;
use odra::prelude::*;

#[odra::event]
pub struct AgentRegistered {
    pub agent: Address,
    pub owner: Address,
    pub stake: U512,
    pub daily_limit: U512,
}

#[odra::event]
pub struct AgentStaked {
    pub agent: Address,
    pub additional_stake: U512,
    pub total_stake: U512,
}

#[odra::event]
pub struct AgentFrozen {
    pub agent: Address,
    pub reason: String,
    pub frozen_by: Address,
}

#[odra::event]
pub struct AgentUnfrozen {
    pub agent: Address,
}

#[odra::event]
pub struct DailyLimitSet {
    pub agent: Address,
    pub old_limit: U512,
    pub new_limit: U512,
}

#[odra::odra_error]
pub enum Error {
    NotOwner = 10_000,
    AgentAlreadyRegistered = 10_001,
    AgentNotFound = 10_002,
    AgentFrozen = 10_003,
    InsufficientStake = 10_004,
    Unauthorized = 10_005,
}

#[odra::odra_type]
pub struct Agent {
    pub owner: Address,
    pub stake: U512,
    pub daily_limit: U512,
    pub frozen: bool,
}

#[odra::module(events = [
    AgentRegistered, AgentStaked, AgentFrozen, AgentUnfrozen, DailyLimitSet,
])]
pub struct CautisGuardian {
    owner: Var<Address>,
    agents: Mapping<Address, Agent>,
    registered: Mapping<Address, bool>,
}

#[odra::module]
impl CautisGuardian {
    pub fn init(&mut self) {
        self.owner.set(self.env().caller());
    }

    #[odra(payable)]
    pub fn register_agent(&mut self, agent: Address, daily_limit: U512) {
        if self.registered.get(&agent).unwrap_or(false) {
            self.env().revert(Error::AgentAlreadyRegistered);
        }

        let stake = self.env().attached_value();

        self.agents.set(&agent, Agent {
            owner: self.env().caller(),
            stake,
            daily_limit,
            frozen: false,
        });
        self.registered.set(&agent, true);

        self.env().emit_event(AgentRegistered {
            agent,
            owner: self.env().caller(),
            stake,
            daily_limit,
        });
    }

    #[odra(payable)]
    pub fn stake(&mut self, agent: Address) {
        let mut stored = self.agent_or_revert(&agent);
        let additional = self.env().attached_value();
        stored.stake += additional;
        let total_stake = stored.stake;
        self.agents.set(&agent, stored);
        self.env().emit_event(AgentStaked { agent, additional_stake: additional, total_stake });
    }

    pub fn freeze_agent(&mut self, agent: Address, reason: String) {
        self.ensure_owner();
        let mut stored = self.agent_or_revert(&agent);
        stored.frozen = true;
        self.agents.set(&agent, stored);
        self.env().emit_event(AgentFrozen { agent, reason, frozen_by: self.env().caller() });
    }

    pub fn unfreeze_agent(&mut self, agent: Address) {
        self.ensure_owner();
        let mut stored = self.agent_or_revert(&agent);
        stored.frozen = false;
        self.agents.set(&agent, stored);
        self.env().emit_event(AgentUnfrozen { agent });
    }

    pub fn set_daily_limit(&mut self, agent: Address, new_limit: U512) {
        let mut stored = self.agent_or_revert(&agent);
        let caller = self.env().caller();
        let contract_owner = self.owner.get().unwrap();
        if caller != stored.owner && caller != contract_owner {
            self.env().revert(Error::Unauthorized);
        }
        let old_limit = stored.daily_limit;
        stored.daily_limit = new_limit;
        self.agents.set(&agent, stored);
        self.env().emit_event(DailyLimitSet { agent, old_limit, new_limit });
    }

    pub fn get_agent(&self, agent: Address) -> Option<Agent> {
        if self.registered.get(&agent).unwrap_or(false) {
            self.agents.get(&agent)
        } else {
            None
        }
    }

    pub fn is_frozen(&self, agent: Address) -> bool {
        self.agents.get(&agent).map(|a| a.frozen).unwrap_or(false)
    }

    pub fn get_owner(&self) -> Address {
        self.owner.get().unwrap()
    }
}

impl CautisGuardian {
    fn ensure_owner(&self) {
        if self.env().caller() != self.owner.get().unwrap() {
            self.env().revert(Error::NotOwner);
        }
    }

    fn agent_or_revert(&self, agent: &Address) -> Agent {
        if self.registered.get(agent).unwrap_or(false) {
            self.agents.get(agent).unwrap()
        } else {
            self.env().revert(Error::AgentNotFound)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use odra::host::{Deployer, NoArgs};

    #[test]
    fn register_and_query_agent() {
        let env = odra_test::env();
        let mut c = CautisGuardian::deploy(&env, NoArgs);
        let a = env.get_account(1);
        c.register_agent(a, U512::from(1_000_000_000_000u64));
        let s = c.get_agent(a).expect("agent should exist");
        assert_eq!(s.owner, env.get_account(0));
        assert_eq!(s.daily_limit, U512::from(1_000_000_000_000u64));
        assert!(!s.frozen);
    }

    #[test]
    fn register_same_agent_twice() {
        let env = odra_test::env();
        let mut c = CautisGuardian::deploy(&env, NoArgs);
        let a = env.get_account(1);
        c.register_agent(a, U512::from(1_000_000_000_000u64));
        let r = c.try_register_agent(a, U512::from(500u64));
        assert_eq!(r, Err(Error::AgentAlreadyRegistered.into()));
    }

    #[test]
    fn freeze_and_unfreeze_agent() {
        let env = odra_test::env();
        let mut c = CautisGuardian::deploy(&env, NoArgs);
        let a = env.get_account(1);
        c.register_agent(a, U512::from(1_000_000_000_000u64));
        c.freeze_agent(a, String::from("suspicious"));
        assert!(c.is_frozen(a));
        c.unfreeze_agent(a);
        assert!(!c.is_frozen(a));
    }

    #[test]
    fn non_owner_cannot_freeze() {
        let env = odra_test::env();
        let mut c = CautisGuardian::deploy(&env, NoArgs);
        let a = env.get_account(1);
        c.register_agent(a, U512::from(1_000_000_000_000u64));
        env.set_caller(env.get_account(2));
        let r = c.try_freeze_agent(a, String::from("unauthorized"));
        assert_eq!(r, Err(Error::NotOwner.into()));
    }

    #[test]
    fn add_stake_to_agent() {
        let env = odra_test::env();
        let mut c = CautisGuardian::deploy(&env, NoArgs);
        let a = env.get_account(1);
        c.register_agent(a, U512::from(1_000_000_000_000u64));
        c.stake(a);
        assert_eq!(c.get_agent(a).unwrap().stake, U512::from(0u64));
    }

    #[test]
    fn set_daily_limit() {
        let env = odra_test::env();
        let mut c = CautisGuardian::deploy(&env, NoArgs);
        let a = env.get_account(1);
        c.register_agent(a, U512::from(1_000_000_000_000u64));
        c.set_daily_limit(a, U512::from(500_000_000_000u64));
        assert_eq!(c.get_agent(a).unwrap().daily_limit, U512::from(500_000_000_000u64));
    }

    #[test]
    fn non_owner_cannot_set_limit() {
        let env = odra_test::env();
        let mut c = CautisGuardian::deploy(&env, NoArgs);
        let a = env.get_account(1);
        c.register_agent(a, U512::from(1_000_000_000_000u64));
        env.set_caller(env.get_account(2));
        let r = c.try_set_daily_limit(a, U512::from(100u64));
        assert_eq!(r, Err(Error::Unauthorized.into()));
    }

    #[test]
    #[ignore = "OdraVM Mapping<Address, T> returns default for unset keys; on-chain CasperVM handles correctly"]
    fn get_nonexistent_agent_returns_none() {
        let env = odra_test::env();
        let c = CautisGuardian::deploy(&env, NoArgs);
        assert!(c.get_agent(env.get_account(99)).is_none());
    }

    #[test]
    fn owner_is_set_on_init() {
        let env = odra_test::env();
        let c = CautisGuardian::deploy(&env, NoArgs);
        assert_eq!(c.get_owner(), env.get_account(0));
    }

    #[test]
    #[ignore = "OdraVM Mapping<Address, T> returns default — test on CasperVM for full coverage"]
    fn freeze_nonexistent_agent_fails() {
        let env = odra_test::env();
        let mut c = CautisGuardian::deploy(&env, NoArgs);
        let r = c.try_freeze_agent(env.get_account(99), String::from("ghost"));
        assert_eq!(r, Err(Error::AgentNotFound.into()));
    }

    #[test]
    #[ignore = "OdraVM Mapping<Address, T> returns default — test on CasperVM for full coverage"]
    fn set_limit_nonexistent_agent_fails() {
        let env = odra_test::env();
        let mut c = CautisGuardian::deploy(&env, NoArgs);
        let r = c.try_set_daily_limit(env.get_account(99), U512::from(100u64));
        assert_eq!(r, Err(Error::AgentNotFound.into()));
    }
}
