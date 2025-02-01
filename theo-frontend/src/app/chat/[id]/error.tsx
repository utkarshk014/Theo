"use client";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-lg font-semibold mb-4">Something went wrong!</h2>
      <button
        className="px-4 py-2 bg-primary text-white rounded"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
