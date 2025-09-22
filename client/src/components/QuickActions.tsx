import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  CalendarPlus, 
  FileText, 
  Mail, 
  DollarSign, 
  Bell,
  GraduationCap,
  Users
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  action: string;
  variant?: "default" | "secondary" | "outline";
}

export function QuickActions() {
  //todo: remove mock functionality
  const quickActions: QuickAction[] = [
    {
      title: "Add New Student",
      description: "Register a new student",
      icon: UserPlus,
      action: "add-student",
    },
    {
      title: "Mark Attendance",
      description: "Take today's attendance",
      icon: CalendarPlus,
      action: "mark-attendance",
      variant: "secondary",
    },
    {
      title: "Generate Report",
      description: "Create academic reports",
      icon: FileText,
      action: "generate-report",
      variant: "outline",
    },
    {
      title: "Send Notification",
      description: "Broadcast to parents",
      icon: Mail,
      action: "send-notification",
    },
    {
      title: "Fee Collection",
      description: "Process payments",
      icon: DollarSign,
      action: "fee-collection",
      variant: "secondary",
    },
    {
      title: "Make Announcement",
      description: "School-wide notice",
      icon: Bell,
      action: "make-announcement",
      variant: "outline",
    },
    {
      title: "Add Teacher",
      description: "Register new staff",
      icon: GraduationCap,
      action: "add-teacher",
    },
    {
      title: "Create Class",
      description: "Setup new class",
      icon: Users,
      action: "create-class",
      variant: "secondary",
    },
  ];

  const handleActionClick = (action: string) => {
    console.log(`Quick action triggered: ${action}`);
    // Here you would typically navigate to the appropriate page or open a modal
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant={action.variant || "default"}
              className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
              onClick={() => handleActionClick(action.action)}
              data-testid={`quick-action-${action.action}`}
            >
              <action.icon className="h-6 w-6" />
              <div>
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-70">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}