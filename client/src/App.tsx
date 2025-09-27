// Referenced from javascript_log_in_with_replit integration
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import Teachers from "@/pages/Teachers";
import Fees from "@/pages/Fees";
import Admission from "@/pages/Admission";
import Classes from "@/pages/Classes";
import Landing from "@/pages/Landing";
import About from "@/pages/About";
import Results from "@/pages/Results";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

function AuthenticatedRouter() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admission" component={Admission} />
      <Route path="/students" component={Students} />
      <Route path="/teachers" component={Teachers} />
      <Route path="/classes" component={Classes} />
      <Route path="/attendance" component={Dashboard} /> {/* TODO: Create Attendance page */}
      <Route path="/academics" component={Dashboard} /> {/* TODO: Create Academics page */}
      <Route path="/fees" component={Fees} />
      <Route path="/messages" component={Dashboard} /> {/* TODO: Create Messages page */}
      <Route path="/reports" component={Dashboard} /> {/* TODO: Create Reports page */}
      <Route path="/announcements" component={Dashboard} /> {/* TODO: Create Announcements page */}
      <Route path="/settings" component={Dashboard} /> {/* TODO: Create Settings page */}
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public routes - accessible without authentication */}
      <Route path="/" component={Landing} />
      <Route path="/about" component={About} />
      <Route path="/admission" component={Admission} />
      <Route path="/results" component={Results} />
      <Route path="/contact" component={Contact} />

      {/* Protected routes - require authentication */}
      {isAuthenticated && (
        <>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/students" component={Students} />
          <Route path="/teachers" component={Teachers} />
          <Route path="/fees" component={Fees} />
        </>
      )}

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show landing page for non-authenticated users
  if (isLoading || !isAuthenticated) {
    return (
      <TooltipProvider>
        <ThemeProvider>
          <Router />
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    );
  }

  // Custom sidebar width for school management application
  const sidebarStyle = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <TooltipProvider>
      <ThemeProvider>
        <SidebarProvider style={sidebarStyle as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between p-4 border-b bg-background">
                <div className="flex items-center gap-4">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <div className="hidden md:block">
                    <h2 className="text-lg font-semibold">EduConnect</h2>
                    <p className="text-xs text-muted-foreground">School Management System</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.location.href = '/api/logout'}
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </header>
              <main className="flex-1 overflow-auto">
                <AuthenticatedRouter />
              </main>
            </div>
          </div>
          <Toaster />
        </SidebarProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
}

export default App;
