import type { ReactNode } from "react";

type AppShellProps = {
  badge: string;
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function AppShell({
  badge,
  title,
  actions,
  children,
}: AppShellProps) {
  return (
    <main className="app-shell">
      <header className="app-shell__header">
        <div>
          <p className="app-shell__badge">{badge}</p>
          <h1>{title}</h1>
        </div>
        {actions ? <div className="app-shell__actions">{actions}</div> : null}
      </header>
      {children}
    </main>
  );
}
