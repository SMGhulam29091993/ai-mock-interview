"use server";

import { auth, db } from "@/firebase/admin";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const signUp = async (params: SignUpParams) => {
  const { uid, name, email } = params;
  try {
    const existUser = await db.collection("users").doc(uid).get();
    if (existUser.exists) {
      return {
        success: false,
        message: "User already exists",
      };
    }
    await db.collection("users").doc(uid).set({
      name,
      email,
    });
    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error: any) {
    console.error("Error during sign up:", error);
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already in use",
      };
    }
    return {
      success: false,
      message: error.message,
    };
  }
};

export const signIn = async (params: SignInParams) => {
  const { email, idToken } = params;
  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User not found",
      };
    }
    await setSessionCookies(idToken);
    return {
      success: true,
      message: "Sign in successful",
    };
  } catch (error) {
    console.error("Error during sign in:", error);
    return {
      success: false,
      message: "Sign in failed",
    };
  }
};

export const setSessionCookies = async (idToken: string) => {
  const cookieStore = await cookies();
  const sessionCookies = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK,
  });

  cookieStore.set({
    name: "session",
    value: sessionCookies,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: ONE_WEEK / 1000, // in seconds
  });
};

export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await auth.getUser(decodedClaims.sub);
    const userDoc = await db.collection("users").doc(userRecord.uid).get();
    if (!userDoc.exists) return null;

    return {
      ...userDoc.data(),
      id: userDoc.id,
    } as User;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};
