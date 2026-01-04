"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  );
}

export function LoginForm() {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="trader@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>
      {errorMessage && (
        <div className="text-red-500 text-sm text-center">{errorMessage}</div>
      )}
      <SubmitButton />
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
