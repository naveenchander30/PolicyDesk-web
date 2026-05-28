import { Suspense } from "react";
import { AuthForm } from "@/features/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <Suspense fallback={<div className="auth-form" style={{padding:32,textAlign:"center",color:"var(--on-surface-variant)"}}>Loading...</div>}>
        <AuthForm />
      </Suspense>
    </main>
  );
}
