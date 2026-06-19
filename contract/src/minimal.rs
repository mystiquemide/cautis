use odra::prelude::*;
use odra::casper_types::U512;

#[odra::event]
pub struct RecordSet {
    pub key: Address,
    pub value: U512,
}

#[odra::odra_error]
pub enum Error {
    NotFound = 10_000,
}

#[odra::odra_type]
pub struct Record {
    pub value: U512,
    pub owner: Address,
}

#[odra::module(events = [RecordSet])]
pub struct TestContract {
    records: Mapping<Address, Record>,
    owner: Var<Address>,
}

#[odra::module]
impl TestContract {
    pub fn init(&mut self) {
        self.owner.set(self.env().caller());
    }

    pub fn set_record(&mut self, key: Address, value: U512) {
        self.records.set(&key, Record {
            value,
            owner: self.env().caller(),
        });
        self.env().emit_event(RecordSet { key, value });
    }

    pub fn get_record(&self, key: Address) -> Option<Record> {
        self.records.get(&key)
    }

    pub fn get_or_revert(&self, key: &Address) -> Record {
        self.records.get(key).unwrap_or_else(|| self.env().revert(Error::NotFound))
    }

    pub fn get_owner(&self) -> Address {
        self.owner.get().unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use odra::host::{Deployer, NoArgs};

    #[test]
    fn record_with_events() {
        let env = odra_test::env();
        let mut c = TestContract::deploy(&env, NoArgs);
        let addr = odra_test::env().get_account(1);
        c.set_record(addr, U512::from(42u64));
        assert!(c.get_record(addr).is_some());
    }

    #[test]
    #[should_panic(expected = "NotFound")]
    fn revert_works() {
        let env = odra_test::env();
        let c = TestContract::deploy(&env, NoArgs);
        let addr = odra_test::env().get_account(1);
        c.get_or_revert(&addr);
    }

    #[test]
    fn owner_set() {
        let env = odra_test::env();
        let c = TestContract::deploy(&env, NoArgs);
        assert_eq!(c.get_owner(), odra_test::env().get_account(0));
    }
}
