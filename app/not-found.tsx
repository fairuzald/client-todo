"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NotFound = () => {
  const [pathname, setPathname] = useState<string>("");

  useEffect(() => {
    setPathname(window.location.pathname);

    console.error(
      "404 Error: User attempted to access non-existent route:",
      window.location.pathname
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        {pathname && (
          <p className="text-gray-500 mb-4">
            The page{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">{pathname}</code>{" "}
            does not exist
          </p>
        )}
        <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
