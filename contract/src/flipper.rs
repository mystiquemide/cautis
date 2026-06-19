use odra::prelude::*;

#[odra::module]
pub struct Flipper {
    value: Var<bool>,
}

#[odra::module]
impl Flipper {
    pub fn init(&mut self) {
        self.value.set(false);
    }

    pub fn set(&mut self, value: bool) {
        self.value.set(value);
    }

    pub fn flip(&mut self) {
        self.value.set(!self.get());
    }

    pub fn get(&self) -> bool {
        self.value.get_or_default()
    }
}

#[cfg(test)]
mod tests {
    use super::Flipper;
    use odra::host::{Deployer, NoArgs};

    #[test]
    fn flipping() {
        let env = odra_test::env();
        let mut contract = Flipper::deploy(&env, NoArgs);
        assert!(!contract.get());
        contract.flip();
        assert!(contract.get());
    }
}
