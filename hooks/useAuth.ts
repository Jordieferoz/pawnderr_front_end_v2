// hooks/useAuth.ts
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { clearUser } from "@/store/userSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  const logout = async () => {
    // Clear Redux user state
    dispatch(clearUser());

    // Sign out from NextAuth
    await signOut({ redirect: false });

    // Clear session storage
    sessionStorage.clear();

    // Redirect to sign in
    router.push("/sign-in");
  };

  return {
    user,
    isAuthenticated,
    logout
  };
};

export { useAuth };
