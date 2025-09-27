import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Mail, Phone, Eye, Edit, Users } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Teacher } from '@shared/schema';
import { z } from 'zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import teacherAvatar from "@assets/generated_images/Teacher_user_avatar_7312f236.png";

// Create a proper form schema for teacher creation (matches backend validation)
const teacherFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  teacherId: z.string().min(1, "Teacher ID is required"),
  qualifications: z.string().optional(),
  subjects: z.string().optional(), // Will be parsed as JSON array
  phone: z.string().optional(),
  address: z.string().optional(),
  salary: z.string().optional(),
});

type TeacherFormData = z.infer<typeof teacherFormSchema>;

interface TeacherWithUser extends Teacher {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function Teachers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch teachers from API
  const { data: teachers = [], isLoading, error } = useQuery<TeacherWithUser[]>({
    queryKey: ['/api/teachers'],
  });

  // Add teacher mutation
  const addTeacherMutation = useMutation({
    mutationFn: async (data: TeacherFormData) => {
      return apiRequest('POST', '/api/teachers', {
        ...data,
        subjects: data.subjects ? JSON.parse(`[${data.subjects.split(',').map(s => `"${s.trim()}"`).join(',')}]`) : [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teachers'] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Teacher added successfully",
        description: "The new teacher has been added to the school staff.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add teacher",
        description: error.message || "There was an error adding the teacher.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      teacherId: '',
      qualifications: '',
      subjects: '',
      phone: '',
      address: '',
      salary: '',
    },
    mode: 'onChange',
  });

  function onSubmit(data: TeacherFormData) {
    addTeacherMutation.mutate(data);
  }

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(teacher => {
    const searchLower = searchTerm.toLowerCase();
    return (
      teacher.user?.firstName?.toLowerCase().includes(searchLower) ||
      teacher.user?.lastName?.toLowerCase().includes(searchLower) ||
      teacher.teacherId.toLowerCase().includes(searchLower) ||
      teacher.qualifications?.toLowerCase().includes(searchLower) ||
      teacher.subjects?.some(subject => subject.toLowerCase().includes(searchLower))
    );
  });

  const getStatusBadge = (isActive: boolean) => {
    return isActive ?
      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge> :
      <Badge variant="secondary">Inactive</Badge>;
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Error loading teachers</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'Failed to load teachers'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-teacher">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Teacher</DialogTitle>
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
                        name="teacherId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teacher ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter teacher ID" {...field} data-testid="input-teacher-id" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="qualifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualifications</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., M.Ed, B.Ed, M.Sc" {...field} data-testid="input-qualifications" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subjects"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subjects (comma-separated)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Mathematics, Physics, Chemistry" {...field} data-testid="input-subjects" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="salary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Salary</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter monthly salary" {...field} data-testid="input-salary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter full address" {...field} data-testid="input-address" />
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
                      <Button type="submit" disabled={addTeacherMutation.isPending}
                        data-testid="button-save-teacher">
                        {addTeacherMutation.isPending ? 'Adding...' : 'Add Teacher'}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading teachers...</p>
              </div>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No teachers found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first teacher.'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-first-teacher">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Teacher
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTeachers.map((teacher) => (
                <Card key={teacher.id} className="hover-elevate">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={teacherAvatar} alt={`${teacher.user?.firstName} ${teacher.user?.lastName}`} />
                        <AvatarFallback>
                          {teacher.user?.firstName?.[0]}{teacher.user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm truncate" data-testid={`teacher-name-${teacher.id}`}>
                            {teacher.user?.firstName} {teacher.user?.lastName}
                          </h3>
                          {getStatusBadge(teacher.isActive ?? false)}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">{teacher.teacherId}</p>

                        <div className="mt-2 space-y-1">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Qualifications:</p>
                            <p className="text-xs">{teacher.qualifications || 'Not specified'}</p>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Subjects:</p>
                            <div className="flex flex-wrap gap-1">
                              {teacher.subjects && teacher.subjects.length > 0 ? teacher.subjects.map((subject) => (
                                <Badge key={subject} variant="outline" className="text-xs">
                                  {subject}
                                </Badge>
                              )) : (
                                <span className="text-xs text-muted-foreground">None assigned</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground truncate">{teacher.user?.email}</span>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
