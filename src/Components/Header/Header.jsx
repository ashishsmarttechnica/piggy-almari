"use client";

import Image from "next/image";
import Link from "next/link";
import { FaPhone } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
export default function Header() {
  return (
    <header className="w-full bg-theme-black text-white">
      <div className="mx-auto container px-5 flex items-center justify-between h-15 md:h-24 lg:h-[105px]">
        <div className="items-center gap-2 fs-20 font-medium opacity-90 hidden sm:flex">
          <span aria-hidden>
            <FaPhone className="text-white" />
          </span>
          <span>Need Help?</span>
        </div>

        <Link
          href="/"
          className="inline-flex items-center"
          aria-label="Piggy Almari home"
        >
          <Image
            src="/PiggyAlmariLogo.png"
            alt="Piggy Almari"
            width={200}
            height={60}
            priority
            className="h-10 w-auto md:h-15"
          />
        </Link>

        <div className="items-center gap-2 fs-20 font-medium opacity-90 hidden sm:flex">
          <button type="button" className="hover:opacity-100 hidden sm:flex items-center gap-2">
            <span aria-hidden="true">
              <FaMapMarkerAlt className="text-white" />
            </span>
            Select Location
          </button>
        </div>
        <div className="flex sm:hidden items-center gap-3 fs-20 font-medium opacity-90">
          <span aria-hidden="true">
            <FaPhone className="text-white" />
          </span>
          <span aria-hidden="true">
            <FaMapMarkerAlt className="text-white" />
          </span>
        </div>
      </div>
    </header>
  );
}
