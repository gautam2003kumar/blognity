'use client'

import * as React from 'react'
import {
  IconLockCancel,
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
  IconWriting,
} from '@tabler/icons-react'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: IconDashboard,
    },
    {
      title: 'Blogs',
      url: '/user-blog',
      icon: IconListDetails,
    },
    {
      title: 'Change password',
      url: '/auth/change-password',
      icon: IconLockCancel,
    },
    {
      title: 'Start writing',
      url: '/blog/write-blog',
      icon: IconWriting,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/home">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Blognity</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
