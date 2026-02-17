import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet, LogOut, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

interface WalletConnectButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  showIcon?: boolean;
}

const WalletConnectButton = ({
  className,
  size = "sm",
  variant = "outline",
  showIcon = true,
}: WalletConnectButtonProps) => {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);

  const handleConnect = () => setVisible(true);

  const handleCopyAddress = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey.toBase58());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const connectButtonClass = cn(
    "gap-2 rounded-lg border border-primary/40 bg-primary/5 text-foreground font-medium",
    "hover:border-primary/60 hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98]",
    "transition-all duration-200 shadow-sm",
    className,
  );

  if (connected && publicKey) {
    const address = publicKey.toBase58();
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            className={cn(
              "gap-2 font-mono rounded-lg border border-primary/30 bg-primary/5",
              "hover:border-primary/50 hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98]",
              "transition-all duration-200 shadow-sm",
              className,
            )}
            aria-label="Wallet menu"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-500 opacity-75" aria-hidden />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            </span>
            {truncateAddress(address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-[320px] rounded-xl border border-border bg-card/95 p-0 shadow-xl shadow-black/10 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
        >
          <div className="px-4 pt-4 pb-2">
            <DropdownMenuLabel className="flex items-center gap-2 px-0 py-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500 opacity-80" aria-hidden />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              </span>
              Connected
            </DropdownMenuLabel>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="mt-3 w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-left font-mono text-sm text-muted-foreground transition-colors hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card"
            >
              <span className="tracking-wide">{truncateAddress(address, 6)}</span>
              <span className="mt-1.5 flex items-center gap-1.5 text-[10px] text-primary">
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied to clipboard
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Click to copy
                  </>
                )}
              </span>
            </button>
          </div>
          <DropdownMenuSeparator className="bg-border" />
          <div className="p-1.5">
            <DropdownMenuItem
              onClick={() => disconnect()}
              className="cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Disconnect wallet
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size}
      className={connectButtonClass}
      onClick={handleConnect}
      aria-label="Connect wallet"
    >
      {showIcon && <Wallet className="h-4 w-4 shrink-0" />}
      Connect Wallet
    </Button>
  );
};

export default WalletConnectButton;
