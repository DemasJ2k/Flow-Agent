"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  LineChart,
  BookOpen,
  Lightbulb,
  Wrench,
  BookMarked,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { logout } from "@/lib/actions";
import { useSidebar } from "./sidebar-context";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Chat", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Charts", href: "/dashboard/charts", icon: LineChart },
  { name: "Journal", href: "/dashboard/journal", icon: BookOpen },
  { name: "Strategies", href: "/dashboard/strategies", icon: Lightbulb },
  { name: "Tools", href: "/dashboard/tools", icon: Wrench },
  { name: "Playbooks", href: "/dashboard/playbooks", icon: BookMarked },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-gray-900 transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
          <h1 className="text-xl font-bold text-white">Trading AI</h1>
          <button
            onClick={close}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={close}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-800 p-4">
          <form action={logout}>
            <button
              type="submit"
              className="group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
