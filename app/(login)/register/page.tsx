import { Suspense } from "react";

import { Register } from "@/ui_components/Register";

export const metadata = {
  title: "Pawnderr - Register",
  description: "Pawnderr - Register"
};

export default function RegisterPage() {
  return (
    <Suspense>
      <Register />
    </Suspense>
  );
}
