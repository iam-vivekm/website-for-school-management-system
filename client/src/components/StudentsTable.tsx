import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import studentAvatar from "@assets/generated_images/Student_user_avatar_44984815.png";

interface Student {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  section: string;
  attendance: number;
  status: "active" | "inactive" | "suspended";
  avatar?: string;
}

export function StudentsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  
  //todo: remove mock functionality
  const students: Student[] = [
    {
      id: "1",
      name: "Emily Johnson",
      studentId: "STU001",
      grade: "Grade 10",
      section: "A",
      attendance: 95,
      status: "active",
      avatar: studentAvatar,
    },
    {
      id: "2",
      name: "Michael Brown",
      studentId: "STU002",
      grade: "Grade 10",
      section: "A",
      attendance: 88,
      status: "active",
    },
    {
      id: "3",
      name: "Sarah Davis",
      studentId: "STU003",
      grade: "Grade 9",
      section: "B",
      attendance: 92,
      status: "active",
    },
    {
      id: "4",
      name: "David Wilson",
      studentId: "STU004",
      grade: "Grade 11",
      section: "C",
      attendance: 76,
      status: "inactive",
    },
    {
      id: "5",
      name: "Jessica Lee",
      studentId: "STU005",
      grade: "Grade 10",
      section: "B",
      attendance: 98,
      status: "active",
    },
  ];

  const getStatusBadge = (status: Student["status"]) => {
    switch (status) {
      case "active": return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>;
      case "inactive": return <Badge variant="secondary">Inactive</Badge>;
      case "suspended": return <Badge variant="destructive">Suspended</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return "text-green-600";
    if (attendance >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Students Management</CardTitle>
            <CardDescription>
              View and manage all students in your school
            </CardDescription>
          </div>
          <Button onClick={() => console.log('Add student clicked')} data-testid="button-add-student">
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
              data-testid="input-search-students"
            />
          </div>
          <Button variant="outline" onClick={() => console.log('Filter clicked')} data-testid="button-filter">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 font-medium text-muted-foreground">Student</th>
                <th className="text-left py-2 px-2 font-medium text-muted-foreground">ID</th>
                <th className="text-left py-2 px-2 font-medium text-muted-foreground">Grade</th>
                <th className="text-left py-2 px-2 font-medium text-muted-foreground">Attendance</th>
                <th className="text-left py-2 px-2 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-2 px-2 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b hover-elevate">
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium" data-testid={`student-name-${student.id}`}>
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-mono text-sm">{student.studentId}</td>
                  <td className="py-3 px-2">
                    <span className="text-sm">{student.grade}</span>
                    <span className="text-xs text-muted-foreground ml-1">({student.section})</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`font-medium ${getAttendanceColor(student.attendance)}`}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {getStatusBadge(student.status)}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => console.log(`View student ${student.id}`)}
                        data-testid={`button-view-student-${student.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => console.log(`Edit student ${student.id}`)}
                        data-testid={`button-edit-student-${student.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => console.log(`Delete student ${student.id}`)}
                        data-testid={`button-delete-student-${student.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}