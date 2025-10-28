"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { InputField } from "@/ui_components/Shared";
import { images } from "@/utils/images";
import {
  signInSchema,
  type SignInValues,
  signUpSchema,
  type SignUpValues,
} from "@/utils/schemas/auth";

type Mode = "signin" | "signup";

export function Login({ mode = "signin" }: { mode?: Mode }) {
  const isSignup = mode === "signup";
  const schema = isSignup ? signUpSchema : signInSchema;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    trigger,
  } = useForm<SignInValues | SignUpValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: isSignup
      ? { email: "", password: "", confirmPassword: "" }
      : { email: "", password: "" },
  });

  const password = watch("password");
  const confirmPassword = isSignup
    ? watch("confirmPassword" as keyof SignUpValues)
    : undefined;

  const onSubmit = async () => {
    // Submit to server action or API
    // e.g., await signUp(values) or signIn(values)
  };

  useEffect(() => {
    if (isSignup && confirmPassword) {
      void trigger("confirmPassword" as keyof SignUpValues);
    }
  }, [password, isSignup, confirmPassword, trigger]);

  return (
    <div className="relative min-h-[100dvh] px-5 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href={"/"} className="mb-7.5 flex justify-center">
          <Image
            src={images.logo.src}
            className="logo w-[147px]"
            width={147}
            height={97}
            alt="PAWnderr Logo"
          />
        </Link>
        <h1 className="heading1 text-dark-brown mb-3 px-6 text-center">
          {isSignup ? "Create Your PAWnderr Profile" : "Welcome Back"}
        </h1>
        <p
          className={`subtitle1 text-light-grey px-7 text-center ${isSignup ? "mb-10" : "mb-16"}`}
        >
          {isSignup
            ? "Because every connection starts with a simple hello."
            : "Your dog's next meaningful connection could be just a few clicks away.."}
        </p>
      </div>

      <img
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-1/2"
        src={images.authPattern.src}
        alt="Decorative pattern"
      />

      <div className="mb-10 flex items-center justify-center gap-5">
        <button type="button" className="cursor-pointer">
          <Image
            src={images.google.src}
            width={70}
            height={70}
            alt="Sign in with Google"
          />
        </button>
        <button type="button" className="cursor-pointer">
          <Image
            src={images.facebook.src}
            width={70}
            height={70}
            alt="Sign in with Facebook"
          />
        </button>
        <button type="button" className="cursor-pointer">
          <Image
            src={images.x.src}
            width={70}
            height={70}
            alt="Sign in with X"
          />
        </button>
      </div>

      <p className="text-dark-grey paragraph1 mb-8 text-center">
        -Or use your Email-
      </p>

      <form
        className="mb-7 flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="relative">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <InputField
                label="Email"
                placeholder="Email"
                type="email"
                {...field}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            )}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="relative">
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <InputField
                isPassword
                label={isSignup ? "Set Password" : "Password"}
                placeholder={isSignup ? "Create a password" : "Password"}
                type="password"
                {...field}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />
            )}
          />
          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {isSignup && (
          <div className="relative">
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <InputField
                  isPassword
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  type="password"
                  {...field}
                  aria-invalid={Boolean(
                    "confirmPassword" in errors && errors.confirmPassword
                  )}
                  aria-describedby={
                    "confirmPassword" in errors && errors.confirmPassword
                      ? "confirm-error"
                      : undefined
                  }
                />
              )}
            />
            {"confirmPassword" in errors && errors.confirmPassword && (
              <p id="confirm-error" className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          suppressHydrationWarning
        >
          {isSignup ? "Sign Up" : "Sign In"}
        </Button>
      </form>

      <div className="mb-10 text-center">
        <p className="paragraph1_bold text-grey-200">
          {isSignup ? "Already have an account?" : " New to PAWnderr?"}{" "}
          <Link
            href={isSignup ? "/sign-in" : "/sign-up"}
            className="text-yellow"
          >
            {isSignup ? "Sign In" : "Create an Account"}
          </Link>
        </p>
      </div>
    </div>
  );
}
