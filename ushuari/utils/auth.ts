import { useAuthStore } from "@/store/useAuthStore";
import { UserRole } from "@/types";

export const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "organization":
      return "/organization/dashboard";
    case "user":
    default:
      return "/dashboard";
  }
};

export const redirectToDashboard = (router: any) => {
  const user = useAuthStore.getState().user;
  if (!user) return;

  const path = getDashboardPath(user.role);
  router.push(path);
};
