"use client";

import { Moon } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full bg-[#0A1B34] border-b border-[#1c2e4c] text-white px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-yellow-400">Los Simpsons</h1>
      <button className="p-2 hover:bg-[#1f2d49] rounded-md transition" title="Modo claro/oscuro">
        <Moon className="w-5 h-5 text-gray-300" />
      </button>
    </nav>
  );
}
