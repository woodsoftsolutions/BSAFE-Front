// src/lib/services/auth.ts

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  employee?: any;
}

export function saveAuthUser(user: AuthUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem("authUser", JSON.stringify(user));
  }
}

export function getAuthUser(): AuthUser | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("authUser");
    if (data) return JSON.parse(data);
  }
  return null;
}

export function clearAuthUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authUser");
  }
}
