import { Suspense } from "react";

import { Login } from "../login";

export const metadata = {
  title: "Pawnderr - Sign in",
  description: "Pawnderr - Sign in"
};

export default function SignInPage() {
  return (
    <Suspense>
      <Login mode="signin" />
    </Suspense>
  );
}
