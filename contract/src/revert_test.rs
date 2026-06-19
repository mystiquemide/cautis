use odra::prelude::*;
use odra::host::{Deployer, NoArgs};

#[odra::odra_error]
pub enum Error {
    NotFound = 1,
}

#[odra::module]
pub struct TestMod {
    map_addr_val: Mapping<Address, u32>,
}

#[odra::module]
impl TestMod {
    pub fn init(&mut self) {}

    pub fn get_or_revert(&self, key: Address) -> u32 {
        self.map_addr_val
            .get(&key)
            .unwrap_or_else(|| self.env().revert(Error::NotFound))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn nonexistent_address_key_reverts() {
        let env = odra_test::env();
        let c = TestMod::deploy(&env, NoArgs);
        let fake = env.get_account(99);
        let result = c.try_get_or_revert(fake);
        assert_eq!(result, Err(Error::NotFound.into()));
    }
}
