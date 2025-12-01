export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-light-gray rounded-full"></div>
          <div className="absolute inset-0 border-4 border-theme-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

