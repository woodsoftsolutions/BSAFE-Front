import React from 'react';

import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function FullWidthPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}

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
  );
}