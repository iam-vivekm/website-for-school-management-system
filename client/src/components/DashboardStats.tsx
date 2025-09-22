import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, UserCheck, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: any;
}

function StatCard({ title, value, change, changeType, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        <div className={`text-xs flex items-center gap-1 mt-1 ${
          changeType === 'increase' ? 'text-green-600' : 'text-red-600'
        }`}>
          {changeType === 'increase' ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {change}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  //todo: remove mock functionality
  const stats = [
    {
      title: "Total Students",
      value: "1,247",
      change: "+12% from last month",
      changeType: "increase" as const,
      icon: GraduationCap,
    },
    {
      title: "Total Teachers",
      value: "84",
      change: "+2 new this month",
      changeType: "increase" as const,
      icon: Users,
    },
    {
      title: "Attendance Rate",
      value: "94.2%",
      change: "-1.2% from yesterday",
      changeType: "decrease" as const,
      icon: UserCheck,
    },
    {
      title: "Fee Collection",
      value: "$45,231",
      change: "+8% this month",
      changeType: "increase" as const,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}