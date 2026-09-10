import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
// import { invoke } from "@tauri-apps/api/core";
import type { AppConfig } from "@/types";


interface SettingsProps {
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  setError: (error: string) => void;
  setMessage: (message: string) => void;
}

const Settings = ({ config, setConfig, isSaving, setIsSaving, setError, setMessage }: SettingsProps) => {
  async function saveConfig() {
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      // const savedConfig = await invoke<AppConfig>("update_config", {
      //   deviceIp: config.device_ip,
      //   port: config.port,
      //   timeout: config.timeout,
      //   pingInterval: config.ping_interval,
      //   reconnect: config.reconnect,
      // });
      // setConfig(savedConfig);
      setMessage("Saved. Reconnecting to the new host...");
      toast.add({
        type: "success",
        title: "Saved",
        description: "Reconnecting to the new host...",
        timeout: 2000
      })
    } catch (reason) {
      setMessage(String(reason))
      toast.add({
        type: "error",
        title: "Error",
        description: String(reason),
        timeout: 5000
      })
    } finally {
      setIsSaving(false);
    }
  }


  return (
    <section className="mt-5 rounded-2xl border border-[#d8d0c5] bg-[#faf8f4] p-6 sm:p-8">
      <div className="mb-6">
        <p className="mb-1 text-lg font-semibold">Device connection</p>
        <p className="text-sm text-[#777870]">Choose where this app should connect.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-4 sm:items-end">
        <label className="grid sm:col-span-3 gap-2 text-sm font-medium">
          Host or IP address
          <input
            value={config.device_ip}
            onChange={(event) => setConfig({ ...config, device_ip: event.target.value })}
            className="h-10 rounded-lg border border-[#d8d0c5] bg-white px-3 text-sm outline-none transition focus:border-[#8a5a34] focus:ring-2 focus:ring-[#8a5a34]/20"
            placeholder="192.168.100.43"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Port
          <input
            type="number"
            min={1}
            max={65535}
            value={config.port}
            onChange={(event) => setConfig({ ...config, port: Number(event.target.value) })}
            className="h-10 rounded-lg border border-[#d8d0c5] bg-white px-3 text-sm outline-none transition focus:border-[#8a5a34] focus:ring-2 focus:ring-[#8a5a34]/20"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4 sm:items-end">
        <label className="grid gap-2 text-sm font-medium">
          Timeout (s)
          <input
            type="number"
            min={0}
            max={60}
            value={config.timeout}
            onChange={(event) => setConfig({ ...config, timeout: Number(event.target.value) })}
            className="h-10 rounded-lg border border-[#d8d0c5] bg-white px-3 text-sm outline-none transition focus:border-[#8a5a34] focus:ring-2 focus:ring-[#8a5a34]/20"
            placeholder="5"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Ping interval (s)
          <input
            type="number"
            min={0}
            max={60}
            value={config.ping_interval}
            onChange={(event) => setConfig({ ...config, ping_interval: Number(event.target.value) })}
            className="h-10 rounded-lg border border-[#d8d0c5] bg-white px-3 text-sm outline-none transition focus:border-[#8a5a34] focus:ring-2 focus:ring-[#8a5a34]/20"
            placeholder="2"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Reconnect (s)
          <input
            type="number"
            min={0}
            max={60}
            value={config.reconnect}
            onChange={(event) => setConfig({ ...config, reconnect: Number(event.target.value) })}
            className="h-10 rounded-lg border border-[#d8d0c5] bg-white px-3 text-sm outline-none transition focus:border-[#8a5a34] focus:ring-2 focus:ring-[#8a5a34]/20"
          />
        </label>
        <Button onClick={() => void saveConfig()} disabled={isSaving} className="h-10 bg-[#30332f] px-5 text-[#faf8f4] hover:bg-[#484c46]">
          {isSaving ? "Saving..." : "Save host"}
        </Button>
      </div>
    </section>
  );
};

export default Settings;
