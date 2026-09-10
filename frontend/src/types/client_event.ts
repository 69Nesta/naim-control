export type ClientEvent =
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
