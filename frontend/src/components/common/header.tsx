import * as React from "react";

export interface HeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
  backButton?: boolean;
  goBack?: () => void;
}

export default function Header({
  title,
  description,
  onClick,
  buttonText,
  backButton,
  goBack,
}: HeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-4 flex space-x-4 items-center">
          {backButton && (
            <button data-testid="header-back-button" onClick={goBack}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                color="#000000"
                fill="none"
              >
                <path
                  d="M4 12L20 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.99996 17C8.99996 17 4.00001 13.3176 4 12C3.99999 10.6824 9 7 9 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <data value="">
            <h3 data-testid='header-title' className="text-base font-semibold leading-6 text-gray-900">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </data>
        </div>
        {onClick && buttonText && (
          <div className="ml-4 mt-4 flex-shrink-0">
            <button
              data-testid="header-action-button"
              onClick={onClick}
              type="button"
              className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
