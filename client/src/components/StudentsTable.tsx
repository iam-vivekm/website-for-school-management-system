import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Eye, Edit, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Student } from '@shared/schema';
import { z } from 'zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import studentAvatar from "@assets/generated_images/Student_user_avatar_44984815.png";

// Create a proper form schema for student creation (matches backend validation)
const studentFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  studentId: z.string().min(1, "Student ID is required"),
  gradeId: z.string().optional(),
  sectionId: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  parentName: z.string().optional(),
  parentEmail: z.string().email().optional().or(z.literal("")),
  parentPhone: z.string().optional(),
  bloodGroup: z.string().optional(),
  medicalInfo: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentFormSchema>;

interface StudentWithUser extends Student {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function StudentsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Fetch students from API
  const { data: students = [], isLoading, error } = useQuery<StudentWithUser[]>({
    queryKey: ['/api/students'],
  });
  
  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      return apiRequest('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/students'] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Student added successfully",
        description: "The new student has been enrolled in the school.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add student",
        description: error.message || "There was an error adding the student.",
        variant: "destructive",
      });
    },
  });
  
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      studentId: '',
      gradeId: '',
      sectionId: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      bloodGroup: '',
      medicalInfo: '',
    },
    mode: 'onChange',
  });
  
  function onSubmit(data: StudentFormData) {
    addStudentMutation.mutate(data);
  }
  
  // Mock data fallback for development
  const mockStudents = [
    {
      id: "1",
      name: "Emily Johnson",
      studentId: "STU001",
      grade: "10",
      section: "A",
      attendance: 95,
      status: "active",
      avatar: studentAvatar,
    },
  ];

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge> :
      <Badge variant="secondary">Inactive</Badge>;
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return "text-green-600";
    if (attendance >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  // Filter students based on search term
  const filteredStudents = students.length > 0 ? students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.user?.firstName?.toLowerCase().includes(searchLower) ||
      student.user?.lastName?.toLowerCase().includes(searchLower) ||
      student.studentId.toLowerCase().includes(searchLower) ||
      student.gradeId?.toLowerCase().includes(searchLower) ||
      student.user?.email?.toLowerCase().includes(searchLower)
    );
  }) : [];
  
  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Error loading students</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'Failed to load students'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-student">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} data-testid="input-first-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} data-testid="input-last-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email address" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter student ID" {...field} data-testid="input-student-id" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="gradeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-grade">
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="KG">Kindergarten</SelectItem>
                              <SelectItem value="1">Grade 1</SelectItem>
                              <SelectItem value="2">Grade 2</SelectItem>
                              <SelectItem value="3">Grade 3</SelectItem>
                              <SelectItem value="4">Grade 4</SelectItem>
                              <SelectItem value="5">Grade 5</SelectItem>
                              <SelectItem value="6">Grade 6</SelectItem>
                              <SelectItem value="7">Grade 7</SelectItem>
                              <SelectItem value="8">Grade 8</SelectItem>
                              <SelectItem value="9">Grade 9</SelectItem>
                              <SelectItem value="10">Grade 10</SelectItem>
                              <SelectItem value="11">Grade 11</SelectItem>
                              <SelectItem value="12">Grade 12</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sectionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., A, B, C" {...field} data-testid="input-section" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bloodGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Group</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., A+, B-, O+" {...field} data-testid="input-blood-group" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="parentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent/Guardian Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter parent name" {...field} data-testid="input-parent-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="parentEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter parent email" {...field} data-testid="input-parent-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="medicalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Information</FormLabel>
                        <FormControl>
                          <Input placeholder="Any medical conditions or notes" {...field} data-testid="input-medical-info" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}
                      data-testid="button-cancel">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addStudentMutation.isPending}
                      data-testid="button-save-student">
                      {addStudentMutation.isPending ? 'Adding...' : 'Add Student'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading students...</p>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No students found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first student.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-first-student">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Student
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Student</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Grade</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Parent</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover-elevate" data-testid={`row-student-${student.id}`}>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={studentAvatar} alt={`${student.user?.firstName} ${student.user?.lastName}`} />
                          <AvatarFallback>
                            {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium" data-testid={`student-name-${student.id}`}>
                            {student.user?.firstName} {student.user?.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground" data-testid={`student-email-${student.id}`}>
                            {student.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono text-sm" data-testid={`student-id-${student.id}`}>                     {student.studentId}
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm" data-testid={`student-grade-${student.id}`}>Grade {student.gradeId}</span>
                      <span className="text-xs text-muted-foreground ml-1" data-testid={`student-section-${student.id}`}>({student.sectionId})</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-sm" data-testid={`parent-name-${student.id}`}>
                        {student.emergencyContact}
                      </div>
                      <div className="text-xs text-muted-foreground" data-testid={`parent-email-${student.id}`}>
                        Contact info
                      </div>
                    </td>
                    <td className="py-3 px-2" data-testid={`student-status-${student.id}`}>
                      {getStatusBadge(student.isActive ?? false)}
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
        )}
      </CardContent>
    </Card>
  );
}