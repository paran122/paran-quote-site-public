"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Monitor,
  Component,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/quotes", label: "견적 요청", icon: ClipboardList },
  { href: "/admin/blog", label: "블로그", icon: FileText },
  { href: "/admin/portfolio", label: "행사 관리", icon: Briefcase },
  { href: "/admin/photos", label: "Work 페이지", icon: Monitor },
  { href: "/admin/components", label: "컴포넌트", icon: Component },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // 라우트 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    onMobileClose();
  }, [pathname, onMobileClose]);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const navContent = (
    <>
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100">
        {!collapsed && (
          <span className="text-sm font-bold text-slate-900 truncate">
            파란컴퍼니 Admin
          </span>
        )}
        <button
          onClick={onMobileClose}
          className="md:hidden p-1 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>
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

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex h-10 items-center justify-center border-t border-slate-100
          text-slate-400 hover:text-slate-600 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex ${
          collapsed ? "w-16" : "w-56"
        } bg-white border-r border-slate-200 flex-col transition-all duration-200 shrink-0`}
      >
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
