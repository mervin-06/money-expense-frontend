import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
  asideTitle?: string;
  asidePoints?: string[];
};

export default function AuthShell({
  eyebrow,
  title,
  children,
  asideTitle = "Smarter money decisions",
  asidePoints = [
    "Fast signup and login flow",
    "Salary-based onboarding",
    "Expense history with clean summaries",
  ],
}: AuthShellProps) {
  return (
    <main className="auth-shell">
      <section className="auth-hero">
        <p className="auth-hero__eyebrow">{eyebrow}</p>
        <h1>{asideTitle}</h1>
        <div className="auth-hero__grid">
          {asidePoints.map((point) => (
            <article className="auth-hero__card" key={point}>
              <span className="auth-hero__bullet" aria-hidden="true" />
              <p>{point}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="auth-panel">
        <p className="auth-panel__eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {children}
      </section>
    </main>
  );
}
