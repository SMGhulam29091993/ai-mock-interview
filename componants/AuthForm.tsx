"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.actions";
import { useTransition, useState, useEffect } from "react";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up"
        ? z
            .string()
            .min(3, "Username must be at least 3 characters long")
            .max(50, "Username must be at most 20 characters long")
        : z.string().optional(),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(18, "Password must be at most 18 characters long"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const formSchema = authFormSchema(type);

  // Ensure component only renders after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        if (type === "sign-in") {
          const { email, password } = values;
          const userCredentials = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

          const idToken = await userCredentials.user.getIdToken();
          if (!idToken) {
            toast.error("Login failed.");
            return;
          }

          // Server Action will handle cookies and redirect
          const result = await signIn({ email, idToken });

          if (result && !result.success) {
            console.log(result.message);

            toast.error(result.message);
            return;
          }

          toast.success("Signed in successfully!");
          router.push("/");
        } else {
          const { name, email, password } = values;

          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const res = await signUp({
            uid: userCredential.user.uid,
            name: name!,
            email,
            password,
          });

          if (res && !res.success) {
            toast.error(res.message);
            return;
          }
          toast.success("Account created successfully!");
          router.push("/signIn");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  // Don't render until after hydration to prevent ID mismatch
  if (!mounted) {
    return (
      <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
          <div className="flex flex-row gap-2 justify-center">
            <Image src="/logo.svg" alt="logo" height={32} width={38} />
            <h2 className="text-primary-100">Interview with AI</h2>
          </div>
          <h3>Practice mock job interview</h3>
          <div className="w-full h-48 flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const isSignIn = type === "sign-in";
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">Interview with AI</h2>
        </div>
        <h3>Practice mock job interview</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your full name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your personal email"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
            />
            <Button className="btn" type="submit" disabled={isPending}>
              {isPending
                ? isSignIn
                  ? "Signing In..."
                  : "Creating Account..."
                : isSignIn
                ? "Sign In"
                : "Create an account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={isSignIn ? "/signUp" : "/signIn"}
            className="font-bold text-user-primary ml-1"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
