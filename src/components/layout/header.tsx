"use client";

import { User, Menu } from "lucide-react";
import { useSidebar } from "./sidebar-context";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const { toggle } = useSidebar();

  return (
    <header className="h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">{user?.email || "User"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
