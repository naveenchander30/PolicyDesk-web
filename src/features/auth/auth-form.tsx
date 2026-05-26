"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { getAuthErrors } from "@/lib/auth/auth";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

type ValidationErrors = {
  email?: string;
  password?: string;
  submit?: string;
};

const copy = {
  login: {
    title: "Log in",
    description: "Access your client book and payment dashboard.",
    submit: "Log in",
    alternate: "Need an account?",
    alternateHref: "/signup",
    alternateLabel: "Create one"
  },
  signup: {
    title: "Create account",
    description: "Set up access for your PolicyDesk workspace.",
    submit: "Create account",
    alternate: "Already have an account?",
    alternateHref: "/login",
    alternateLabel: "Log in"
  }
} satisfies Record<AuthMode, Record<string, string>>;

export function AuthForm({ mode }: AuthFormProps) {
  const content = copy[mode];
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validationErrors = getAuthErrors(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (error) {
          setErrors({ submit: error.message });
          return;
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim()
        });

        if (error) {
          setErrors({ submit: error.message });
          return;
        }
      }

      router.push("/dashboard");
    } catch {
      setErrors({ submit: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div>
        <p className="eyebrow">PolicyDesk</p>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </div>

      {errors.submit && <p className="field-error">{errors.submit}</p>}

      <label>
        <span>Email</span>
        <input
          autoComplete="email"
          inputMode="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
          disabled={isLoading}
        />
      </label>
      {errors.email ? <p className="field-error">{errors.email}</p> : null}

      <label>
        <span>Password</span>
        <input
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
          disabled={isLoading}
        />
      </label>
      {errors.password ? (
        <p className="field-error">{errors.password}</p>
      ) : null}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : content.submit}
      </button>

      <p className="auth-switch">
        {content.alternate}{" "}
        <Link href={content.alternateHref}>{content.alternateLabel}</Link>
      </p>
    </form>
  );
}
