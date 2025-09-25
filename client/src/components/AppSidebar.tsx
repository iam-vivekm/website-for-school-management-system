import { BookOpen, Calendar, DollarSign, GraduationCap, Home, MessageSquare, Settings, Users, UserCheck, BarChart3, Bell, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

//todo: remove mock functionality
const mockSchoolLogo = "/api/placeholder/40/40";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Admission", url: "/admission", icon: FileText },
  { title: "Students", url: "/students", icon: GraduationCap },
  { title: "Teachers", url: "/teachers", icon: Users },
  { title: "Classes", url: "/classes", icon: BookOpen },
  { title: "Attendance", url: "/attendance", icon: UserCheck },
  { title: "Academics", url: "/academics", icon: Calendar },
  { title: "Fees", url: "/fees", icon: DollarSign },
  { title: "Messages", url: "/messages", icon: MessageSquare, badge: "3" },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Announcements", url: "/announcements", icon: Bell },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={mockSchoolLogo} alt="School Logo" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">Greenwood High School</p>
            <p className="text-xs text-muted-foreground">School Admin</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarSeparator />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                  >
                    <a href={item.url} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/settings" data-testid="nav-settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
