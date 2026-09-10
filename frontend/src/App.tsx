import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Controls from "@/components/Controls";
import { Toaster, toast } from "@/components/ui/toast";
import { useClient } from "@/hooks/useClient";


function App() {
  const {
    config,
    state,
    prevState,
    setPrevState,
    setVolume,
    setInput
  } = useClient()
  const [message, setMessage] = useState("Loading device settings...");
  const [error, setError] = useState("");

  useEffect(() => {
    setMessage(state.connected ? "Ready to control your Naim device" : "Waiting for the Naim device...");

    if (state.connected && !prevState.connected) {
      toast.add({
        type: "success",
        title: "Connected",
        description: "You are now connected to your Naim device.",
        timeout: 5000,
      });
    }
    setPrevState(state);
  }, [state, prevState, setPrevState])

  return (
    <main className="min-h-screen bg-[#f4f1eb] px-5 py-8 text-[#202321] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Header
          config={config}
          state={state}
        />

        <Controls
          state={state}
          setError={setError}
          setMessage={setMessage}
          setVolume={setVolume}
          setInput={setInput}
        />

        {/*<Settings
          config={config}
          setConfig={setConfig}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
          setError={setError}
          setMessage={setMessage}
        />*/}

        {(message || error) && <p className={`mt-4 px-1 text-sm ${error ? "text-red-700" : "text-[#777870]"}`}>{error || message}</p>}
      </div>
      <Toaster />
    </main>
  );
}

export default App;
