mod client_bridge;
mod config;
mod ws;

use axum::{Router, routing::get};
use config::AppConfig;
use naim_client::SharedConn;
use std::sync::Arc;
use tokio::sync::broadcast;
use tower_http::services::ServeDir;

#[derive(Clone)]
pub struct AppState {
    pub shared: Arc<SharedConn>,
    pub event_tx: broadcast::Sender<client_bridge::ClientEvent>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cfg = AppConfig::load()?;

    let (shared, event_tx) = client_bridge::spawn_amp_bridge(
        cfg.device_ip.clone(),
        cfg.port,
        cfg.reconnect,
        cfg.timeout,
        cfg.ping_interval,
    );

    let state = AppState { shared, event_tx };

    let app = Router::new()
        .route("/ws", get(ws::ws_handler))
        .fallback_service(ServeDir::new(&cfg.static_dir))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind(&cfg.bind_addr).await?;
    println!("listening on {}", cfg.bind_addr);
    axum::serve(listener, app).await?;
    Ok(())
}
