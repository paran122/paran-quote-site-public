"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  ImageIcon,
  Component,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/blog", label: "블로그", icon: FileText },
  { href: "/admin/portfolio", label: "포트폴리오", icon: Briefcase },
  { href: "/admin/photos", label: "사진 관리", icon: ImageIcon },
  { href: "/admin/components", label: "컴포넌트", icon: Component },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-56"
      } bg-white border-r border-slate-200 flex flex-col transition-all duration-200 shrink-0`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-slate-100">
        {!collapsed && (
          <span className="text-sm font-bold text-slate-900 truncate">
            파란컴퍼니 Admin
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm transition-colors ${
                active
                  ? "bg-primary-50 text-primary font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-10 flex items-center justify-center border-t border-slate-100
          text-slate-400 hover:text-slate-600 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
