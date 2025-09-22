import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function AttendanceChart() {
  //todo: remove mock functionality
  const data = [
    { name: "Mon", students: 95, teachers: 98 },
    { name: "Tue", students: 92, teachers: 96 },
    { name: "Wed", students: 96, teachers: 100 },
    { name: "Thu", students: 89, teachers: 94 },
    { name: "Fri", students: 87, teachers: 92 },
    { name: "Sat", students: 91, teachers: 89 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Attendance Trends</CardTitle>
        <CardDescription>
          Attendance percentage for students and teachers this week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis domain={[80, 100]} className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="students" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              name="Students"
            />
            <Line 
              type="monotone" 
              dataKey="teachers" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              name="Teachers"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}