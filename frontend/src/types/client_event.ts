export type ClientEvent =
  | {
      type: "ConfigUpdate";
      payload: {
        device_ip: string;
        port: number;
        timeout: number;
        ping_interval: number;
        reconnect: number;
      }
    }
  | {
      type: "StatusUpdate";
      payload: {
        volume: number | null;
        input: string | null;
        connected: boolean;
      }
    }
  | {
      type: "Response";
      name: string;
      id: number | null;
      raw: string;
    }
  | {
      type: "Error";
      message: string;
    };
