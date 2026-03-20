import { Flame } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Flame className="h-3.5 w-3.5 text-fire-400" />
          <span>
            <span className="font-semibold text-primary-400">TL Fire Watch</span>{" "}
            / SF Tenderloin fire damage finder
          </span>
        </div>
        <div className="text-xs text-[var(--muted-foreground)]">
          Data from SF OpenData (DataSF)
        </div>
      </div>
    </footer>
  );
}
