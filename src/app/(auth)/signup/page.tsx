import { AuthForm } from "@/features/auth/auth-form";

export default function SignupPage() {
  return (
    <main className="auth-page">
      <AuthForm mode="signup" />
    </main>
  );
}
