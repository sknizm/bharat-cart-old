import { redirect } from "next/navigation";
import { toast } from "sonner";

export async function handleLogout() {
  await fetch("/api/auth/signout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  // Clear client-side cache and prevent back navigation
  
  toast.success("Logout successfully");
  window.history.replaceState(null, '', '/');
  redirect('/');
}