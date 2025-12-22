import { Suspense } from "react";

import { Login } from "../login";

export const metadata = {
  title: "Pawnderr - Sign up",
  description: "Pawnderr - Sign up"
};

export default function SignUpPage() {
  return (
    <Suspense>
      <Login mode="signup" />
    </Suspense>
  );
}
