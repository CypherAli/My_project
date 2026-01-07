use anyhow::{Context, Result};
use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct Config {
    pub engine_port: u16,
    pub engine_workers: usize,
    pub nats_url: String,
    pub redis_url: String,
    #[allow(dead_code)]
    pub log_level: String,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        let engine_port = std::env::var("ENGINE_PORT")
            .unwrap_or_else(|_| "9090".to_string())
            .parse()
            .context("Invalid ENGINE_PORT")?;

        let engine_workers = std::env::var("ENGINE_WORKERS")
            .unwrap_or_else(|_| "4".to_string())
            .parse()
            .context("Invalid ENGINE_WORKERS")?;

        let nats_url =
            std::env::var("NATS_URL").unwrap_or_else(|_| "nats://localhost:4222".to_string());

        let redis_url =
            std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://localhost:6379".to_string());

        let log_level = std::env::var("LOG_LEVEL").unwrap_or_else(|_| "info".to_string());

        Ok(Self {
            engine_port,
            engine_workers,
            nats_url,
            redis_url,
            log_level,
        })
    }
}
