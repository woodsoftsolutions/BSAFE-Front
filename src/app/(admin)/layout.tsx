import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';


export const metadata: Metadata = {
  title: {
    template: "BSAFE Admin",
    default: "BSAFE Admin",
  },
  description:
    "BSAFE Admin es una plataforma de gestión de inventarios que permite a los usuarios llevar un control eficiente de sus productos y recursos.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Providers>
        <NextTopLoader showSpinner={false} />

        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex flex-col w-full bg-gray-2 dark:bg-[#020d1a]" 
              //  style={{ width: "80%" }}
               >
            <Header />

            <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
              {children}
            </main>

            <footer className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-t text-sm text-gray-500 border-gray-200 dark:border-gray-700">
              <div className="text-center md:text-left">
                &copy; {new Date().getFullYear()} BSAFE Admin. Desarrollado por{" "}
                <a
                  href="https://woodsoftsolutions.com"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Woodsoft Solutions
                </a>.
              </div>

              <div className="flex gap-4">
                <a
                  href="https://woodsoftsolutions.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500"
                >
                  <LanguageIcon fontSize="small" />
                </a>
                <a
                  href="https://linkedin.com/company/woodsoftsolutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500"
                >
                  <LinkedInIcon fontSize="small" />
                </a>
                <a
                  href="https://github.com/woodsoftsolutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500"
                >
                  <GitHubIcon fontSize="small" />
                </a>
              </div>
            </footer>

          </div>
        </div>
      </Providers>
    </>
  );
}
