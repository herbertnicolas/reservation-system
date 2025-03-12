import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import "./styles.css";

export const PrivateLayout = ({children}) => {

  return (
    <div className="flex h-screen overflow-hidden flex-row main">
      <SidebarProvider>
        <AppSidebar/>
        <SidebarTrigger style={{position: "relative", left: "-25px", top: "10px"}}/>
        <div className="flex-1">
          {children}
        </div>
      </SidebarProvider>
    </div>
  );  
};
