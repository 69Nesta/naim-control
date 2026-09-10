use naim_client::{IncomingMessage, SharedConn, connection_manager, heartbeat_loop};
use serde::Serialize;
use std::sync::Arc;
use tokio::sync::broadcast;

#[derive(Serialize, Clone, Debug)]
#[serde(tag = "type", content = "payload")]
pub enum ClientEvent {
    ConfigUpdate {
        device_ip: String,
        port: u16,
        timeout: u64,
        ping_interval: u64,
        reconnect: u64,
    },
    StatusUpdate {
        volume: Option<u8>,
        input: Option<String>,
        connected: bool,
    },
    Response {
        name: String,
        id: Option<u32>,
        raw: String,
    },
    Error(String),
}

impl From<IncomingMessage> for ClientEvent {
    fn from(msg: IncomingMessage) -> Self {
        match msg {
            IncomingMessage::Status(status) => ClientEvent::StatusUpdate {
                volume: status.volume,
                input: status.input,
                connected: status.connected,
            },
            IncomingMessage::Response { name, id, raw } => ClientEvent::Response { name, id, raw },
            IncomingMessage::Error { raw } => ClientEvent::Error(raw),
            _ => ClientEvent::Error(String::new()),
        }
    }
}

pub fn spawn_amp_bridge(
    device_ip: String,
    port: u16,
    reconnect: u64,
    timeout: u64,
    ping_interval: u64,
) -> (Arc<SharedConn>, broadcast::Sender<ClientEvent>) {
    let host = format!("{device_ip}:{port}");
    let shared = Arc::new(SharedConn::new(host));
    let messages = shared.subscribe();

    let (event_tx, _) = broadcast::channel::<ClientEvent>(100);

    // broadcast::Sender::send est SYNCHRONE, donc appelable depuis un thread std
    {
        let event_tx = event_tx.clone();
        std::thread::spawn(move || {
            for message in messages {
                let _ = event_tx.send(message.into());
            }
        });
    }

    {
        let shared = Arc::clone(&shared);
        std::thread::spawn(move || connection_manager(shared, reconnect, timeout));
    }
    {
        let shared = Arc::clone(&shared);
        std::thread::spawn(move || heartbeat_loop(shared, ping_interval));
    }

    (shared, event_tx)
}
