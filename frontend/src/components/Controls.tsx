import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/toast";
import { INPUTS } from "@/enums"

interface ControlsProps {
  state: {
    volume: number | null;
    input: string | null;
    connected: boolean;
  };
  setError: (error: string) => void;
  setMessage: (message: string) => void;
  setVolume: (volume: number) => void;
  setInput: (input: string) => void;
}


const Controls = ({ state, setError, setMessage, setVolume, setInput }: ControlsProps) => {
  async function changeVolume(value: number | readonly number[]) {
    const nextVolume = typeof value === "number" ? value : (value[0] ?? 0);
    try {
      setVolume(nextVolume);
      setError("");
    } catch (reason) {
      setError(String(reason))
      toast.add({
        type: "error",
        title: "Error",
        description: String(reason),
        timeout: 5000,
      });
    }
  }

  async function changeInput(nextInput: string) {
    try {
      setInput(nextInput);
      setError("");
      setMessage(`Input changed to ${nextInput}`);
      toast.add({
        type: "success",
        title: "Success",
        description: `Input changed to ${nextInput}`,
        timeout: 5000,
      });
    } catch (reason) {
      setError(String(reason))
      toast.add({
        type: "error",
        title: "Error",
        description: String(reason),
        timeout: 5000,
      });
    }
  }

  return (
    <section className="rounded-2xl border border-[#d8d0c5] bg-[#faf8f4] p-6 shadow-[0_18px_50px_rgba(71,58,43,0.08)] sm:p-8">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-[#777870]">Master volume</p>
          <p className="text-7xl font-light tracking-[-0.06em] text-[#30332f]">{state.volume ?? "--"}<span className="ml-2 text-2xl text-[#9a9b94]">%</span></p>
        </div>
        <span className="mb-2 text-sm text-[#777870]">{state.volume ?? "--"} <span className="mx-2 text-[#b8b4ab]">/</span> 100</span>
      </div>
      <Slider value={[state.volume ?? 0]} max={100} step={1} onValueChange={changeVolume} disabled={!state.connected || state.volume === null} className="mb-12" aria-label="Volume" />

      <div className="grid gap-8 border-t border-[#e3ded6] pt-8 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Input
          <select
            value={state.input ?? ""}
            onChange={(event) => void changeInput(event.target.value)}
            disabled={!state.connected || state.input === null}
            className="h-10 rounded-lg border border-[#d8d0c5] bg-white px-3 text-sm outline-none transition focus:border-[#8a5a34] focus:ring-2 focus:ring-[#8a5a34]/20"
          >
            {INPUTS.map((option: string) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <div className="flex items-end justify-between gap-4">
          <p className="text-sm sm:mb-2 leading-6 text-[#777870]">{state.connected ? "Connected to the receiver." : "The receiver is offline."}</p>
          <span className="shrink-0 sm:mb-2 text-sm font-medium text-[#8a5a34]">{state.input ?? "No input"}</span>
        </div>
      </div>
    </section>
  );
};

export default Controls;
