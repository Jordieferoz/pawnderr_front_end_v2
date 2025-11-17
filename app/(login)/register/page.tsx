import { Register } from "@/ui_components/Register";
import { Suspense } from "react";

export const metadata = {
  title: "Pawnderr - Register",
  description: "Pawnderr - Register",
};

export default function RegisterPage() {
  return (
    <Suspense>
      <Register />
    </Suspense>
  );
}
