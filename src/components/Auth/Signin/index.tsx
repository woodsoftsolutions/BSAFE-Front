import Link from "next/link";
import Image from "next/image";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>
      <div className="flex justify-center mb-6">
      <Image src="/images/logo/logo.svg" alt="BSAFE" width={200} height={200}  />
      </div>

      <GoogleSigninButton text="Sign in" />

      <div className="my-6 flex items-center justify-center">
      <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
        O ingresa con tu cuenta
      </div>
      <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
      <SigninWithPassword />
      </div>

      {/* <div className="mt-6 text-center">
      <p>
        Don’t have any account?{" "}
        <Link href="/auth/sign-up" className="text-primary">
        Sign Up
        </Link>
      </p>
      </div> */}
    </>
  );
}
