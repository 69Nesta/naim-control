interface HeaderProps {
  config: {
    device_ip?: string;
    port?: number;
  };
  state: {
    connected: boolean;
  }
}


const Header = ({ config, state }: HeaderProps) => {
  return (
    <header className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a34]">Naim control</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">The listening room</h1>
      </div>
      <div className="mb-1 items-center gap-2 rounded-full border border-[#d8d0c5] bg-[#faf8f4] p-2 xs:py-1.5 xs:px-3 text-xs text-[#6e706c] flex">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${state.connected ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${state.connected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          </span>
          <span className="hidden xs:block">{config.device_ip ? `${config.device_ip}:${config.port}` : "No host configured"}</span>
      </div>
    </header>
  );
};

export default Header;
