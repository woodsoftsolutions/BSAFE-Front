import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { PersonalInfoForm } from "./_components/personal-info";
import Link from "next/dist/client/link";

export const metadata: Metadata = {
  title: "Configuración",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName="Configuración" />

        <div className="flex justify-end mb-4">
        <Link href="/settings">
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition">Ir a Parámetros</button>
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <PersonalInfoForm />
        </div>
      </div>
    </div>
  );
};

