import Link from "next/link";

export default function HomePage() {
  return (
    <main className="public-page">
      <section className="public-panel">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-brand">
              <svg className="hero-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="8" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M16 4L8 8h16L16 4z" fill="currentColor" opacity="0.3"/>
                <rect x="12" y="14" width="8" height="2" rx="1" fill="currentColor" opacity="0.5"/>
                <rect x="12" y="18" width="8" height="2" rx="1" fill="currentColor" opacity="0.5"/>
                <rect x="12" y="22" width="5" height="2" rx="1" fill="currentColor" opacity="0.5"/>
              </svg>
              <p className="eyebrow">PolicyDesk</p>
            </div>
            <h1>Track premium payments without losing the client context.</h1>
            <p className="hero-subtitle">
              Sign in to manage clients, policies, due dates, and payment follow-up.
            </p>
            <div className="public-actions">
              <Link href="/login">Log in</Link>
              <Link href="/login" className="button-secondary">Learn More</Link>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual-card" style={{width:"160px", height:"90px", top:"10%", left:"15%"}}>
              <div className="hv-line" style={{width:"60%", height:"8px", background:"var(--primary)", opacity:0.6, borderRadius:"4px"}}></div>
              <div className="hv-line" style={{width:"40%", height:"6px", marginTop:"8px", background:"var(--outline)", opacity:0.4, borderRadius:"3px"}}></div>
            </div>
            <div className="hero-visual-card" style={{width:"130px", height:"70px", top:"45%", right:"10%"}}>
              <div className="hv-line" style={{width:"50%", height:"8px", background:"var(--secondary)", opacity:0.5, borderRadius:"4px"}}></div>
              <div className="hv-line" style={{width:"70%", height:"6px", marginTop:"8px", background:"var(--outline)", opacity:0.3, borderRadius:"3px"}}></div>
            </div>
            <svg className="hero-curve" viewBox="0 0 200 100" style={{position:"absolute", bottom:"20%", left:"5%", width:"180px", opacity:0.15}}>
              <path d="M0 80 Q50 20 100 60 T200 40" stroke="var(--primary)" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </div>
        <footer className="hero-footer">
          <p>Built for independent insurance agents</p>
        </footer>
      </section>
    </main>
  );
}
