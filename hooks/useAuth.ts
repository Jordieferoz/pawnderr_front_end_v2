// hooks/useAuth.ts
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { clearUser } from "@/store/userSlice";
import { petsStorage } from "@/utils/pets-storage";
import { userStorage } from "@/utils/user-storage";

const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  const logout = async () => {
    // Clear Redux user state (this will also clear persist:user from localStorage)
    dispatch(clearUser());

    // Clear custom userProfile and pets from localStorage
    userStorage.clear();
    petsStorage.clear();

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
