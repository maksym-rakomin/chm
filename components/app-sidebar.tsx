"use client"

import type * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import Link from "next/link"
import {useSidebarVisibility} from "./sidebar-context"
import {useAuthStore} from "@/lib/stores/auth"
import {navigationGroups} from "@/lib/constants/navigation"
import {hasAccess} from "@/lib/types/roles"
import {resolveAccessForPath} from "@/lib/accessControl/map";
import {
  Bell,
  Calendar,
  ClipboardList,
  FileText,
  Home,
  MessageSquare,
  Search,
  Settings,
  TrendingUp,
  UserCheck,
  Users,
  X
} from "lucide-react";

const Icons = {
  home: Home,
  users: Users,
  userCheck: UserCheck,
  calendar: Calendar,
  fileText: FileText,
  clipboardList: ClipboardList,
  trendingUp: TrendingUp,
  messageSquare: MessageSquare,
  bell: Bell,
} as const;

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const {isVisible, hideSidebar} = useSidebarVisibility()
  const {role} = useAuthStore()

  const canShow = (url: string): boolean => {
    const allowed = resolveAccessForPath(url)
    if (!allowed) return true // routes not in access map are considered unrestricted
    if (allowed === "public") return true
    return hasAccess(role, allowed)
  }

  const filteredGroups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canShow(item.url)),
    }))
    .filter((group) => group.items.length > 0)

  if (!isVisible) {
    return null
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <UserCheck className="h-4 w-4"/>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Patient Management</span>
              <span className="truncate text-xs text-muted-foreground">Management System</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={hideSidebar}
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            title="Close sidebar"
          >
            <X className="h-4 w-4"/>
          </Button>
        </div>
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
            <Input placeholder="Search..." className="pl-8"/>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {filteredGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(({title, url, icon}) => {
                  const Icon = Icons[icon];
                  return (
                    <SidebarMenuItem key={title}>
                      <SidebarMenuButton asChild>
                        <Link href={url}>
                          <Icon/>
                          <span>{title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {canShow("/settings") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/settings">
                  <Settings/>
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
        <div className="flex items-center gap-2 px-2 py-2">
          {canShow("/settings")
            ? (<>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg"/>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">John Doe</span>
                <span className="truncate text-xs text-muted-foreground">Case Manager</span>
              </div>
            </>)
            : (
              <Link href="/login" className="flex items-center gap-2" title="Login">
                <span>To Login</span>
              </Link>
            )}
        </div>
      </SidebarFooter>
      <SidebarRail/>
    </Sidebar>
  )
}
