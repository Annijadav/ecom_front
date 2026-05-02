"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    if(!year){
      setYear(new Date().getFullYear());
    }
  }, []);

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200 py-6">
      <div className="max-w-[1330px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <div className="mb-4 md:mb-0">
          <Link href="/">
            <Image
              src="/PHOTO-2025-08-11-15-28-29 (1).jpg"
              width={109}
              height={105}
              alt="Logo"
              className="h-[80px] sm:h-[70px] md:h-[85px] lg:h-[105px] w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Separator Line (optional) */}
        <div className="hidden md:block h-6 mx-6"></div>

        {/* Copyright */}
        <p className="text-sm text-center md:text-left">
          Copyright © {year ?? ""} Misha brands factory. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
