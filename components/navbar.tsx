import { ConnectButton } from "@mysten/dapp-kit";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-40 backdrop-blur-xl">
            <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-border bg-[rgba(10,14,20,0.72)] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.6)]">
                <div className="flex items-center gap-3">
                    <span className="text-lg md:text-xl font-semibold neon-text-cyan tracking-wide select-none">Nereus</span>
                      <span className="hidden sm:inline-flex text-xs px-2 py-1 rounded-md bg-[rgba(255,255,255,0.06)] border border-border text-foreground-dim">Markets</span>
                </div>
                <div className="flex items-center gap-3">
                    <ConnectButton />
                </div>
            </nav>
        </header>
    );
}