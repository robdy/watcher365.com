"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex justify-center items-center container">
      <div className="w-96 h-96 border p-6 flex flex-col rounded-md bg-white items-center justify-center gap-4">
        <h2 className="text-red-600">{error.message}</h2>
        <button
          onClick={() => reset()}
          className="px-8 py-2 border rounded-md bg-red-300 text-white  "
        >
          Try again
        </button>
        <Link href="/" className="px-8 py-2 border rounded-md bg-slate-300">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
