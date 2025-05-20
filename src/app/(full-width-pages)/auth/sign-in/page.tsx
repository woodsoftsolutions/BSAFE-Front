"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Signin from "@/components/Auth/Signin";
import { getAuthUser } from "@/lib/services/auth";

export default function SignIn() {
  const router = useRouter();
  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      // Si ya está autenticado, redirige a la página principal (ajusta la ruta si es necesario)
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="rounded-[10px] bg-white shadow-lg dark:bg-gray-dark dark:shadow-card w-1/2">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl">
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <Signin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

