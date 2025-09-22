import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "urgent";
  date: string;
  priority: "high" | "medium" | "low";
}

export function AnnouncementsBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>([]);
  
  //todo: remove mock functionality
  const announcements: Announcement[] = [
    {
      id: "1",
      title: "Parent-Teacher Meeting",
      message: "Parent-teacher conferences scheduled for next week. Please check the schedule.",
      type: "info",
      date: "2024-01-15",
      priority: "high"
    },
    {
      id: "2",
      title: "Winter Holiday Notice",
      message: "School will be closed from December 20th to January 3rd for winter break.",
      type: "success",
      date: "2024-01-14",
      priority: "medium"
    },
    {
      id: "3",
      title: "Examination Schedule Released",
      message: "Mid-term examination timetable has been published on the school portal.",
      type: "warning",
      date: "2024-01-13",
      priority: "high"
    },
    {
      id: "4",
      title: "New Safety Protocols",
      message: "Updated safety guidelines are now in effect. All staff must review immediately.",
      type: "urgent",
      date: "2024-01-12",
      priority: "high"
    }
  ];

  const activeAnnouncements = announcements.filter(a => !dismissed.includes(a.id));

  if (activeAnnouncements.length === 0) return null;

  const currentAnnouncement = activeAnnouncements[currentIndex];

  const getAnnouncementStyle = (type: Announcement["type"]) => {
    switch (type) {
      case "urgent":
        return "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950";
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950";
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950";
      default:
        return "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950";
    }
  };

  const getBadgeVariant = (type: Announcement["type"]) => {
    switch (type) {
      case "urgent": return "destructive";
      case "warning": return "secondary";
      case "success": return "default";
      default: return "outline";
    }
  };

  const handleDismiss = (id: string) => {
    setDismissed([...dismissed, id]);
    if (currentIndex >= activeAnnouncements.length - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : activeAnnouncements.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex < activeAnnouncements.length - 1 ? currentIndex + 1 : 0);
  };

  return (
    <Card className={`${getAnnouncementStyle(currentAnnouncement.type)} border-2`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Bell className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm" data-testid={`announcement-title-${currentAnnouncement.id}`}>
                  {currentAnnouncement.title}
                </h3>
                <Badge variant={getBadgeVariant(currentAnnouncement.type)} className="text-xs">
                  {currentAnnouncement.type.toUpperCase()}
                </Badge>
                {currentAnnouncement.priority === "high" && (
                  <Badge variant="outline" className="text-xs">High Priority</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground" data-testid={`announcement-message-${currentAnnouncement.id}`}>
                {currentAnnouncement.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(currentAnnouncement.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {activeAnnouncements.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handlePrevious}
                  data-testid="button-announcement-previous"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground px-2">
                  {currentIndex + 1} / {activeAnnouncements.length}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleNext}
                  data-testid="button-announcement-next"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDismiss(currentAnnouncement.id)}
              data-testid={`button-dismiss-announcement-${currentAnnouncement.id}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}