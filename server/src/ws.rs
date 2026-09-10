use crate::AppState;
use axum::extract::State;
use axum::extract::ws::{Message, WebSocket, WebSocketUpgrade};
use axum::response::IntoResponse;

pub async fn ws_handler(ws: WebSocketUpgrade, State(state): State<AppState>) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

async fn handle_socket(mut socket: WebSocket, state: AppState) {
    let mut event_rx = state.event_tx.subscribe();

    let config = &state.config;
    let config_event = crate::client_bridge::ClientEvent::ConfigUpdate {
        device_ip: config.device_ip.clone(),
        port: config.port,
        timeout: config.timeout,
        ping_interval: config.ping_interval,
        reconnect: config.reconnect,
    };
    let json = serde_json::to_string(&config_event).unwrap();
    if socket.send(Message::Text(json.into())).await.is_err() {
        return;
    }

    handle_command(&state, "NVM GETPREAMP").await;

    loop {
        tokio::select! {
            Ok(event) = event_rx.recv() => {
                let json = serde_json::to_string(&event).unwrap();
                if socket.send(Message::Text(json.into())).await.is_err() { break; }
            }
            Some(Ok(msg)) = socket.recv() => {
                if let Message::Text(txt) = msg {
                    handle_command(&state, &txt).await;
                }
            }
            else => break,
        }
    }
}

async fn handle_command(state: &AppState, txt: &str) {
    // send_nvm fait de l'IO bloquante côté naim_client -> spawn_blocking
    let shared = state.shared.clone();
    let cmd = txt.to_string();
    let _ = tokio::task::spawn_blocking(move || shared.send_nvm(&cmd)).await;
}
