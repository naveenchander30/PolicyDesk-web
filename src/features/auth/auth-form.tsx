"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useCallback } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { getAuthErrors } from "@/lib/auth/auth";

type ValidationErrors = {
  email?: string;
  password?: string;
  submit?: string;
};

type TouchedFields = {
  email: boolean;
  password: boolean;
};

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleBlur(field: "email" | "password") {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email" && !email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
    } else if (field === "password" && !password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Password is required." }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});
    setTouched({ email: true, password: true });

    const validationErrors = getAuthErrors(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        setErrors({ submit: error.message });
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        const redirectTo = searchParams?.get("redirect") || "/dashboard";
        router.push(redirectTo);
        router.refresh();
      }, 600);
    } catch {
      setErrors({ submit: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  }

  const emailError = touched.email && errors.email;
  const passwordError = touched.password && errors.password;

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div>
        <p className="eyebrow">PolicyDesk</p>
        <h1>Log in</h1>
        <p>Access your client book and payment dashboard.</p>
      </div>

      {errors.submit && <p className="field-error">{errors.submit}</p>}

      <label>
        <span>Email</span>
        <input
          autoComplete="email"
          inputMode="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => handleBlur("email")}
          type="email"
          value={email}
          disabled={isLoading}
          className={emailError ? "field-error-border" : ""}
          aria-invalid={!!emailError}
        />
      </label>
      {emailError ? <p className="field-error">{emailError}</p> : null}

      <label>
        <span>Password</span>
        <input
          autoComplete="current-password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          onBlur={() => handleBlur("password")}
          type="password"
          value={password}
          disabled={isLoading}
          className={passwordError ? "field-error-border" : ""}
          aria-invalid={!!passwordError}
        />
      </label>
      {passwordError ? <p className="field-error">{passwordError}</p> : null}

      <div className="auth-links">
        <a href="/forgot-password" className="forgot-link" tabIndex={isLoading ? -1 : 0}>
          Forgot password?
        </a>
      </div>

      <button type="submit" disabled={isLoading} className={isSuccess ? "btn-success" : ""}>
        {isLoading ? (
          <span className="btn-spinner" />
        ) : isSuccess ? (
          <span>&#10003; Logged in</span>
        ) : (
          "Log in"
        )}
      </button>

      <p className="auth-switch">
        Don&apos;t have an account? Contact your agency admin.
      </p>
    </form>
  );
}
