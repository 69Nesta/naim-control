// server/src/config.rs
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
        let raw = std::fs::read_to_string("config.toml")?;
        Ok(toml::from_str(&raw)?)
    }
}
