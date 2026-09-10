import { useEffect, useRef, useState } from "react";
import type { ClientState, ClientEvent } from "@/types";


function applyEvent(state: ClientState, e: ClientEvent): ClientState {
  if (e.type === "StatusUpdate") {
    return { ...state, ...e.payload };
  }
  return state;
}

export function useClient() {
  const [prevState, setPrevState] = useState<ClientState>({ connected: false, volume: null, input: null });
  const [state, setState] = useState<ClientState>({ connected: false, volume: null, input: null });
  const wsRef = useRef<WebSocket | null>(null);


  useEffect(() => {
    function connect() {
      const ws = new WebSocket("/ws");
      wsRef.current = ws;

      console.log("Connecting to WebSocket...");
      ws.onopen = () => {
        console.log("WebSocket connected.");
      };

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        setState((prev) => applyEvent(prev, msg));
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected.");
        setTimeout(connect, 1000)
      };
    }

    connect();
    return () => wsRef.current?.close();
  }, []);

  useEffect(() => {
    console.log("state updated:", state);
  }, [state]);

  const sendCommand = (cmd: string) => {
    wsRef.current?.send(cmd);
  };

  const setVolume = (volume: number) => {
    sendCommand(`NVM SETRVOL ${volume}`);
  };

  const setInput = (input: string) => {
    sendCommand(`NVM SETINPUT ${input}`);
  };

  const getPreAmp = () => {
    sendCommand(`NVM GETPREAMP`);
  };

  return { state, setState, prevState, setPrevState, sendCommand, setVolume, setInput, getPreAmp };
}
