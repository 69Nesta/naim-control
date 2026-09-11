// server/src/config.rs
use config::{Config as ConfigLoader, Environment, File};
use serde::Deserialize;

#[derive(Deserialize, Clone)]
pub struct AppConfig {
    pub device_ip: String,
    pub port: u16,
    pub reconnect: u64,
    pub timeout: u64,
    pub ping_interval: u64,
    pub bind_addr: String,
    pub static_dir: String,
}

impl AppConfig {
    pub fn load() -> anyhow::Result<Self> {
        let settings = ConfigLoader::builder()
            .add_source(File::with_name("config.toml"))
            .add_source(Environment::with_prefix("APP").separator("__"))
            .build()?;

        Ok(settings.try_deserialize()?)
    }
}
