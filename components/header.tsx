import {SidebarTrigger} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React from "react";
import {useSidebarVisibility} from "@/components/sidebar-context";

type Props = {
  pageTitle?: string
}

export default function Header({pageTitle = ''}: Props) {
  const {isVisible, showSidebar} = useSidebarVisibility()

  return <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
    <div className="flex items-center gap-2 px-4">
      {isVisible ? (
        <SidebarTrigger className="-ml-1"/>
      ) : (
        <Button variant="ghost" size="icon" onClick={showSidebar} className="h-7 w-7" title="Show sidebar">
          <Menu className="h-4 w-4"/>
        </Button>
      )}
      <Separator orientation="vertical" className="mr-2 h-4"/>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {pageTitle
              ? <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              : <BreadcrumbPage>Dashboard</BreadcrumbPage>
            }
          </BreadcrumbItem>
          {pageTitle && <BreadcrumbSeparator/>}
          {pageTitle && <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
          </BreadcrumbItem>}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>
}
