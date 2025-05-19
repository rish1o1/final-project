"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarOptions } from "@/services/Constants";
import { Plus } from "lucide-react";

export function AppSidebar() {
  const router = useRouter();
  const path = usePathname();

  return (
    <Sidebar>
      {/* Improved Logo Alignment */}
      <SidebarHeader className="flex items-center justify-center py-4 px-4">
        <Image
          src="/Suji.png"
          alt="Suji Logo"
          width={120}
          height={120}
          className="w-[120px] object-contain"
          priority // Add if this is above-the-fold content
        />
      </SidebarHeader>

      {/* Consistent Padding */}
      <div className="px-4">
        <Button
          className="w-full cursor-pointer"
          onClick={() => router.push("/dashboard/create-interview")}
        >
          <Plus className="mr-2" />
          Create New Interview
        </Button>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOptions.map((option, index) => (
              <SidebarMenuItem key={index} className="p-1">
                <SidebarMenuButton
                  asChild
                  className={`p-3 ${
                    path === option.path && "bg-blue-50"
                  }`}
                >
                  <Link href={option.path} className="flex items-center gap-3">
                    <option.icon className="w-5 h-5" />
                    <span
                      className={`text-base font-medium ${
                        path == option.path && "text-primary"
                      }`}
                    >
                      {option.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}

export default AppSidebar;