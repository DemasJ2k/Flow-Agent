"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function registerUser(
  prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Registration failed" };
    }

    return { success: true };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}
