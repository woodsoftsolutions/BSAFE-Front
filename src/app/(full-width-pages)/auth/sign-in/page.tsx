import Signin from "@/components/Auth/Signin";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignIn() {
  return (
    <>

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
    </>
  );
}

