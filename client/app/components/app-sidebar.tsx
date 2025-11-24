import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Command,
  GalleryVerticalEnd,
  Pickaxe,
  Settings2,
  LayoutDashboard,
} from "lucide-react";

import { SidebarNav } from "@/components/navigation/sidebar-nav";
import { NavUser } from "@/components/navigation/nav-user";
import { ColonySwitcher } from "@/components/colony-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "~/hooks/use-current-user";

// This is sample data.
const data = {
  user: {
    username: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  colonies: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
    },
    {
      name: "Evil Corp.",
      logo: Command,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user, isLoading } = useCurrentUser();
  const nav = [
    {
      title: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Ressources",
      url: "/dashboard/ressources",
      icon: Pickaxe,
    },
    {
      title: "Research",
      url: "/dashboard/research",
      icon: BookOpen,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ColonySwitcher colonies={data.colonies} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav items={nav} />
      </SidebarContent>
      <SidebarFooter>
        {isLoading || !user ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="pointer-events-none">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="grid flex-1 gap-1.5 text-left text-sm leading-tight">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <NavUser user={user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
