import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, User, Users, FileText, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const admissionSchema = z.object({
  // Student Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().min(1, "Nationality is required"),
  religion: z.string().optional(),
  caste: z.string().optional(),
  bloodGroup: z.string().optional(),

  // Contact Information
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits"),

  // Academic Information
  previousSchool: z.string().min(1, "Previous school is required"),
  previousGrade: z.string().min(1, "Previous grade is required"),
  percentage: z.string().min(1, "Percentage is required"),
  admissionGrade: z.string().min(1, "Admission grade is required"),
  stream: z.string().optional(),

  // Parent Information
  fatherName: z.string().min(1, "Father's name is required"),
  fatherOccupation: z.string().min(1, "Father's occupation is required"),
  fatherPhone: z.string().min(10, "Father's phone is required"),
  fatherEmail: z.string().email().optional().or(z.literal("")),
  motherName: z.string().min(1, "Mother's name is required"),
  motherOccupation: z.string().min(1, "Mother's occupation is required"),
  motherPhone: z.string().min(10, "Mother's phone is required"),
  motherEmail: z.string().email().optional().or(z.literal("")),

  // Emergency Contact
  emergencyName: z.string().min(1, "Emergency contact name is required"),
  emergencyRelation: z.string().min(1, "Relationship is required"),
  emergencyPhone: z.string().min(10, "Emergency phone is required"),

  // Medical Information
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),

  // Additional Information
  extracurricular: z.string().optional(),
  specialNeeds: z.string().optional(),
  transportRequired: z.boolean().default(false),

  // Declaration
  declaration: z.boolean().refine(val => val === true, "You must accept the declaration"),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

export default function Admission() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      religion: '',
      caste: '',
      bloodGroup: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      previousSchool: '',
      previousGrade: '',
      percentage: '',
      admissionGrade: '',
      stream: '',
      fatherName: '',
      fatherOccupation: '',
      fatherPhone: '',
      fatherEmail: '',
      motherName: '',
      motherOccupation: '',
      motherPhone: '',
      motherEmail: '',
      emergencyName: '',
      emergencyRelation: '',
      emergencyPhone: '',
      medicalConditions: '',
      allergies: '',
      medications: '',
      extracurricular: '',
      specialNeeds: '',
      transportRequired: false,
      declaration: false,
    },
  });

  const steps = [
    { id: 1, title: "Student Info", icon: User },
    { id: 2, title: "Academic Info", icon: GraduationCap },
    { id: 3, title: "Family Info", icon: Users },
    { id: 4, title: "Documents", icon: FileText },
    { id: 5, title: "Review", icon: CheckCircle },
  ];

  const onSubmit = async (data: AdmissionFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Application Submitted Successfully!",
        description: "Your admission application has been received. You will receive a confirmation email shortly.",
      });

      // Reset form
      form.reset();
      setCurrentStep(1);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-gray-900 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Online Admission Application
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join our school community. Fill out the application form below to start your educational journey with us.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id
                    ? 'text-blue-600'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Admission Application Form</CardTitle>
              <CardDescription>
                Please fill out all required information accurately. You can save your progress and continue later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs value={currentStep.toString()} className="w-full">
                    <TabsContent value="1" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter first name" {...field} />
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
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="nationality"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nationality *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter nationality" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="religion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Religion</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter religion" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter phone number" {...field} />
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
                            <FormLabel>Address *</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter full address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter state" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pincode *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter pincode" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="2" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="previousSchool"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Previous School *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter previous school name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="previousGrade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Previous Grade *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter previous grade" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="percentage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Percentage/CGPA *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter percentage or CGPA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="admissionGrade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Admission Grade *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select admission grade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
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
                      </div>

                      <FormField
                        control={form.control}
                        name="stream"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Stream (for Grade 11-12)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select stream" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="science">Science</SelectItem>
                                <SelectItem value="commerce">Commerce</SelectItem>
                                <SelectItem value="arts">Arts</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="3" className="space-y-6">
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Father's Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="fatherName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Father's Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter father's name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="fatherOccupation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Father's Occupation *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter father's occupation" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="fatherPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Father's Phone *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter father's phone" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="fatherEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Father's Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="Enter father's email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Mother's Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="motherName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mother's Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter mother's name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="motherOccupation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mother's Occupation *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter mother's occupation" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="motherPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mother's Phone *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter mother's phone" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="motherEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mother's Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="Enter mother's email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Emergency Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="emergencyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Emergency Contact Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter emergency contact name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="emergencyRelation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Relationship *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Uncle, Aunt, Grandparent" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="emergencyPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Emergency Phone *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter emergency phone" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="4" className="space-y-6">
                      <Alert>
                        <FileText className="h-4 w-4" />
                        <AlertDescription>
                          Please upload the following documents. All documents should be in PDF, JPG, or PNG format and under 5MB each.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Birth Certificate</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload birth certificate</p>
                          <Button variant="outline" className="mt-4">
                            Choose File
                          </Button>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Previous School Report Card</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload latest report card</p>
                          <Button variant="outline" className="mt-4">
                            Choose File
                          </Button>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Transfer Certificate</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload transfer certificate</p>
                          <Button variant="outline" className="mt-4">
                            Choose File
                          </Button>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Parent ID Proof</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload parent's ID proof</p>
                          <Button variant="outline" className="mt-4">
                            Choose File
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="5" className="space-y-6">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Please review all information before submitting. Once submitted, you cannot modify the application.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="declaration"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I declare that all information provided is true and correct to the best of my knowledge. *
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Application Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Student Name:</strong> {form.watch('firstName')} {form.watch('lastName')}
                          </div>
                          <div>
                            <strong>Email:</strong> {form.watch('email')}
                          </div>
                          <div>
                            <strong>Phone:</strong> {form.watch('phone')}
                          </div>
                          <div>
                            <strong>Admission Grade:</strong> Grade {form.watch('admissionGrade')}
                          </div>
                          <div>
                            <strong>Father's Name:</strong> {form.watch('fatherName')}
                          </div>
                          <div>
                            <strong>Mother's Name:</strong> {form.watch('motherName')}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                    >
                      Previous
                    </Button>

                    {currentStep < steps.length ? (
                      <Button type="button" onClick={nextStep}>
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
