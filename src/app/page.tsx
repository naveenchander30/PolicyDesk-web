import Link from "next/link";

export default function HomePage() {
  return (
    <main className="public-page">
      <section className="public-panel">
        <p className="eyebrow">PolicyDesk</p>
        <h1>Track premium payments without losing the client context.</h1>
        <p>
          Sign in to manage clients, policies, due dates, and payment follow-up.
        </p>
        <div className="public-actions">
          <Link href="/login">Log in</Link>
          <Link href="/signup">Create account</Link>
        </div>
      </section>
    </main>
  );
}
