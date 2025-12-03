"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InputField } from "@/ui_components/Shared";
import { images } from "@/utils/images";
import {
  signInSchema,
  type SignInValues,
  signUpSchema,
  type SignUpValues,
} from "@/utils/schemas/auth";
import { usePathname, useRouter } from "next/navigation";

type Mode = "signin" | "signup";

export function Login({ mode = "signin" }: { mode?: Mode }) {
  const router = useRouter();
  const pathname = usePathname();
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
      : { email: "", password: "", rememberMe: false },
  });

  const password = watch("password");
  const confirmPassword = isSignup
    ? watch("confirmPassword" as keyof SignUpValues)
    : undefined;

  const onSubmit = async (data: SignInValues | SignUpValues) => {
    // Set authentication cookie for BOTH signup and signin
    Cookies.set("isAuthenticated", "true", {
      expires: 7, // 7 days
      path: "/",
      sameSite: "lax",
    });

    if (isSignup) {
      router.push("/register");
      router.refresh(); // Ensure middleware re-evaluates with new cookie
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  useEffect(() => {
    if (isSignup && confirmPassword) {
      void trigger("confirmPassword" as keyof SignUpValues);
    }
  }, [password, isSignup, confirmPassword, trigger]);

  return (
    <div className="relative min-h-[100dvh] px-5 pt-12 pb-20 md:px-8">
      <img
        src={images.loginBg.src}
        className="absolute -top-10 left-0 w-full z-0 pointer-events-none hidden md:block"
      />
      <Link
        href={"/"}
        className="mb-7.5 md:flex justify-center hidden relative"
      >
        <Image
          src={images.logoBig.src}
          className="logo w-[250px]"
          width={147}
          height={97}
          alt="PAWnderr Logo"
        />
      </Link>
      <div className="sm:mx-auto sm:w-full sm:max-w-[766px] md:bg-white md:shadow-[0px_4px_16.4px_0px_#0000001A] rounded-4xl md:px-20 md:py-14 relative">
        <Link href={"/"} className="mb-7.5 flex justify-center md:hidden">
          <Image
            src={images.logo.src}
            className="logo w-[147px]"
            width={147}
            height={97}
            alt="PAWnderr Logo"
          />
        </Link>
        <h1 className="display3 text-accent-900 mb-3 px-6 md:px-18 text-center">
          {isSignup ? "Create Your PAWnderr Profile" : "Welcome Back"}
        </h1>
        <p
          className={`body_regular text-light-grey2 px-7 md:px-34 text-center ${isSignup ? "mb-10" : "mb-16"}`}
        >
          {isSignup
            ? "Because every connection starts with a simple hello."
            : "Your dog's next meaningful connection could be just a few clicks away.."}
        </p>
        <div className="md:px-30">
          <img
            className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-1/2 md:hidden"
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

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-white"></div>
            </div>
            <div className="relative flex justify-center">
              <p className="bg-white px-4 text-grey-500 body_medium text-center uppercase">
                Or use your Email
              </p>
            </div>
          </div>

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
                    label="Email Address"
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

            {!isSignup && (
              <div className="flex items-center justify-between px-1 mb-2">
                <div className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name="rememberMe"
                    render={({ field }) => (
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        id="rememberMe"
                      />
                    )}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="body_medium text-dark-grey cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="button2 text-accent-900 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
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

          <div className="text-center">
            <p className="paragraph1_bold text-accent-1000">
              {isSignup ? "Already have an account?" : " New to PAWnderr?"}{" "}
              <Link
                href={isSignup ? "/sign-in" : "/sign-up"}
                className="text-primary-theme"
              >
                {isSignup ? "Sign In" : "Create an Account"}
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* <img src={images.green_right_blur.} /> */}
    </div>
  );
}
