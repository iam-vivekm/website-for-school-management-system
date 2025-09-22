import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import adminAvatar from "@assets/generated_images/Admin_user_avatar_86d31d72.png";
import teacherAvatar from "@assets/generated_images/Teacher_user_avatar_7312f236.png";
import studentAvatar from "@assets/generated_images/Student_user_avatar_44984815.png";

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  action: string;
  target: string;
  time: string;
  type: "success" | "warning" | "info";
}

export function RecentActivity() {
  //todo: remove mock functionality
  const activities: ActivityItem[] = [
    {
      id: "1",
      user: {
        name: "Sarah Wilson",
        avatar: teacherAvatar,
        role: "Teacher"
      },
      action: "marked attendance for",
      target: "Grade 10-A",
      time: "2 minutes ago",
      type: "success"
    },
    {
      id: "2",
      user: {
        name: "John Smith",
        avatar: adminAvatar,
        role: "Admin"
      },
      action: "added new student",
      target: "Emma Johnson",
      time: "15 minutes ago",
      type: "info"
    },
    {
      id: "3",
      user: {
        name: "Mike Chen",
        avatar: studentAvatar,
        role: "Student"
      },
      action: "submitted assignment for",
      target: "Mathematics",
      time: "1 hour ago",
      type: "success"
    },
    {
      id: "4",
      user: {
        name: "Lisa Rodriguez",
        avatar: teacherAvatar,
        role: "Teacher"
      },
      action: "updated grades for",
      target: "Physics Test",
      time: "2 hours ago",
      type: "info"
    },
    {
      id: "5",
      user: {
        name: "Admin System",
        avatar: adminAvatar,
        role: "System"
      },
      action: "fee reminder sent to",
      target: "Grade 9 parents",
      time: "3 hours ago",
      type: "warning"
    }
  ];

  const getBadgeVariant = (type: ActivityItem["type"]) => {
    switch (type) {
      case "success": return "default";
      case "warning": return "secondary";
      case "info": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates from your school management system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback>
                {activity.user.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span>
                {" "}
                <span className="text-muted-foreground">{activity.action}</span>
                {" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <div className="flex items-center gap-2">
                <Badge variant={getBadgeVariant(activity.type)} className="text-xs">
                  {activity.user.role}
                </Badge>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}