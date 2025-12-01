import HomeNavServer from "./HomeNavServer";
import { Suspense } from "react";

function HomeNavFallback() {
  return (
    <div className="w-full bg-light-gray border-b border-dark-gray/20">
      <div className="container mx-auto">
        <nav className="flex items-center justify-center gap-6 whitespace-nowrap px-5 h-12.5">
          <div className="h-7 w-[140px] rounded-md bg-dark-gray/20 animate-pulse"></div>
        </nav>
      </div>
    </div>
  );
}
export default function NavbarWrapper() {
  return (
    <Suspense fallback={<HomeNavFallback />}>
      <HomeNavServer />
    </Suspense>
  );
}
