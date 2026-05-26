"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

type ValidationErrors = {
  email?: string;
  password?: string;
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ValidationErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div>
        <p className="eyebrow">PolicyDesk</p>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </div>

      <label>
        <span>Email</span>
        <input
          autoComplete="email"
          inputMode="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
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
        />
      </label>
      {errors.password ? (
        <p className="field-error">{errors.password}</p>
      ) : null}

      <button type="submit">{content.submit}</button>

      <p className="auth-switch">
        {content.alternate}{" "}
        <Link href={content.alternateHref}>{content.alternateLabel}</Link>
      </p>
    </form>
  );
}
