import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Mail, Phone, Eye, Edit } from "lucide-react";
import { useState } from "react";
import teacherAvatar from "@assets/generated_images/Teacher_user_avatar_7312f236.png";

interface Teacher {
  id: string;
  name: string;
  teacherId: string;
  subjects: string[];
  classes: string[];
  email: string;
  phone: string;
  status: "active" | "inactive";
  avatar?: string;
}

export default function Teachers() {
  const [searchTerm, setSearchTerm] = useState("");
  
  //todo: remove mock functionality
  const teachers: Teacher[] = [
    {
      id: "1",
      name: "Sarah Wilson",
      teacherId: "TCH001",
      subjects: ["Mathematics", "Physics"],
      classes: ["Grade 10-A", "Grade 11-B"],
      email: "sarah.wilson@school.edu",
      phone: "+1 234-567-8901",
      status: "active",
      avatar: teacherAvatar,
    },
    {
      id: "2",
      name: "Michael Chen",
      teacherId: "TCH002",
      subjects: ["English", "Literature"],
      classes: ["Grade 9-A", "Grade 10-C"],
      email: "michael.chen@school.edu",
      phone: "+1 234-567-8902",
      status: "active",
    },
    {
      id: "3",
      name: "Lisa Rodriguez",
      teacherId: "TCH003",
      subjects: ["Chemistry", "Biology"],
      classes: ["Grade 11-A", "Grade 12-B"],
      email: "lisa.rodriguez@school.edu",
      phone: "+1 234-567-8903",
      status: "active",
    },
    {
      id: "4",
      name: "David Thompson",
      teacherId: "TCH004",
      subjects: ["History", "Geography"],
      classes: ["Grade 8-B", "Grade 9-C"],
      email: "david.thompson@school.edu",
      phone: "+1 234-567-8904",
      status: "inactive",
    },
  ];

  const getStatusBadge = (status: Teacher["status"]) => {
    return status === "active" 
      ? <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>
      : <Badge variant="secondary">Inactive</Badge>;
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
        <p className="text-muted-foreground">
          Manage teaching staff, subjects, and class assignments.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Teaching Staff</CardTitle>
              <CardDescription>
                View and manage all teachers in your school
              </CardDescription>
            </div>
            <Button onClick={() => console.log('Add teacher clicked')} data-testid="button-add-teacher">
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                data-testid="input-search-teachers"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="hover-elevate">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={teacher.avatar} alt={teacher.name} />
                      <AvatarFallback>
                        {teacher.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm truncate" data-testid={`teacher-name-${teacher.id}`}>
                          {teacher.name}
                        </h3>
                        {getStatusBadge(teacher.status)}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{teacher.teacherId}</p>
                      
                      <div className="mt-2 space-y-1">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Subjects:</p>
                          <div className="flex flex-wrap gap-1">
                            {teacher.subjects.map((subject) => (
                              <Badge key={subject} variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Classes:</p>
                          <p className="text-xs">{teacher.classes.join(", ")}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">{teacher.email}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => console.log(`View teacher ${teacher.id}`)}
                            data-testid={`button-view-teacher-${teacher.id}`}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => console.log(`Edit teacher ${teacher.id}`)}
                            data-testid={`button-edit-teacher-${teacher.id}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}