"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaUsers, FaHistory } from "react-icons/fa";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-white border-r fixed left-0 top-0 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-800">MyApp</h1>
      </div>
      <nav className="space-y-2">
        <Link 
          href="/" 
          className={`flex items-center gap-2 py-2 px-4 rounded transition-colors ${
            pathname === "/" 
              ? "bg-slate-100 text-slate-900" 
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <FaHome className="w-4 h-4" />
          Dashboard
        </Link>
        <Link 
          href="/students" 
          className={`flex items-center gap-2 py-2 px-4 rounded transition-colors ${
            pathname === "/students" 
              ? "bg-slate-100 text-slate-900" 
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <FaUsers className="w-4 h-4" />
          Students
        </Link>
        <Link 
          href="/visit-log" 
          className={`flex items-center gap-2 py-2 px-4 rounded transition-colors ${
            pathname === "/visit-log" 
              ? "bg-slate-100 text-slate-900" 
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <FaHistory className="w-4 h-4" />
          Visit Log
        </Link>
      </nav>
    </div>
  );
} 