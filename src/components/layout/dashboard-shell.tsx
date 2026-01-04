"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "./sidebar-context";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashboardShellProps {
  children: ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
          <Header user={user} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
