// import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header.jsx"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.jsx"


export default function Layout({ children }) {
    return (
        <SidebarProvider>
            {/* <AppSidebar /> */}
            <SidebarInset >
                <SiteHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}