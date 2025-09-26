import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, Users, BookOpen, BarChart3, DollarSign, Bell, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const { login, signup, isLoggingIn, isSigningUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    schoolName: '',
    role: 'school_admin'
  });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  // School information sections
  const aboutSchool = {
    title: "Welcome to Excel Academy",
    description: "Excel Academy is a premier educational institution committed to nurturing young minds and fostering academic excellence. Founded in 2010, we have been providing quality education to students from kindergarten through high school.",
    vision: "To create a learning environment that inspires students to achieve their full potential and become responsible global citizens.",
    mission: "To provide comprehensive education that combines academic rigor with character development, preparing students for success in an ever-changing world.",
    stats: [
      { label: "Students", value: "1200+" },
      { label: "Teachers", value: "75+" },
      { label: "Years of Excellence", value: "15+" },
      { label: "Pass Rate", value: "96%" }
    ]
  };

  const admissionInfo = {
    title: "Admission Process",
    process: [
      "Online Application Submission",
      "Document Verification",
      "Entrance Assessment",
      "Parent Interview",
      "Final Admission Confirmation"
    ],
    requirements: [
      "Birth Certificate",
      "Previous School Records",
      "Medical Certificate",
      "Parent ID Proof",
      "Recent Photographs"
    ],
    grades: ["Kindergarten", "Grade 1-12"],
    fees: {
      registration: "₹2,000",
      admission: "₹10,000",
      monthly: "₹3,500 - ₹5,500"
    }
  };

  const resultsData = [
    { name: "Priya Sharma", grade: "12th", percentage: 97.8, rank: 1 },
    { name: "Rahul Kumar", grade: "12th", percentage: 96.5, rank: 2 },
    { name: "Ananya Singh", grade: "12th", percentage: 95.2, rank: 3 },
    { name: "Vikram Patel", grade: "10th", percentage: 94.8, rank: 1 },
    { name: "Sneha Gupta", grade: "10th", percentage: 93.9, rank: 2 }
  ];

  const contactInfo = {
    address: "Excel Academy, 456 Education Road, Knowledge City, India - 400001",
    phone: ["+91 98765 43210", "+91 98765 43211"],
    email: ["info@excelacademy.edu.in", "admissions@excelacademy.edu.in"],
    hours: "Monday - Saturday: 8:00 AM - 6:00 PM"
  };

  const features = [
    {
      icon: Users,
      title: "Expert Faculty",
      description: "Our experienced teachers provide personalized attention and mentorship to every student."
    },
    {
      icon: BookOpen,
      title: "Modern Curriculum",
      description: "CBSE affiliated curriculum with additional focus on STEM, arts, and sports education."
    },
    {
      icon: BarChart3,
      title: "Digital Learning",
      description: "Smart classrooms, online resources, and interactive learning platforms."
    },
    {
      icon: DollarSign,
      title: "Affordable Education",
      description: "Quality education at reasonable fees with various scholarship programs available."
    },
    {
      icon: Bell,
      title: "Parent Portal",
      description: "Real-time updates on student progress, attendance, and school announcements."
    },
    {
      icon: GraduationCap,
      title: "Career Guidance",
      description: "Professional counseling and career planning from grade 8 onwards."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-gray-900 dark:to-blue-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EduConnect</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-signup">
              Sign Up
            </Button>
            <Button onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-login">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Complete School Management
            <span className="text-blue-600"> Made Simple</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Streamline your educational institution with our comprehensive platform for student management, attendance tracking, fee collection, and communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-get-started">
              Get Started Today
            </Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-learn-more">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Everything Your School Needs
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From student enrollment to fee collection, manage all aspects of your educational institution with ease.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-blue-600 dark:bg-blue-900">
        <div className="container mx-auto px-4 py-20 text-center text-white">
          <h3 className="text-3xl font-bold mb-8">Why Schools Choose EduConnect</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-100 mb-2">500+</div>
              <p className="text-blue-100">Schools Worldwide</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-100 mb-2">99.9%</div>
              <p className="text-blue-100">Uptime Guarantee</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-100 mb-2">24/7</div>
              <p className="text-blue-100">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* About School Section */}
      <section id="about" className="bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {aboutSchool.title}
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              {aboutSchool.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{aboutSchool.vision}</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{aboutSchool.mission}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {aboutSchool.stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Section */}
      <section id="admission" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {admissionInfo.title}
          </h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="text-xl">Admission Process</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {admissionInfo.process.map((step, index) => (
                  <li key={index} className="flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="text-xl">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {admissionInfo.requirements.map((req, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-blue-600 mr-2">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="text-xl">Fee Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Registration Fee:</span>
                <span className="font-semibold">{admissionInfo.fees.registration}</span>
              </div>
              <div className="flex justify-between">
                <span>Admission Fee:</span>
                <span className="font-semibold">{admissionInfo.fees.admission}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Tuition:</span>
                <span className="font-semibold">{admissionInfo.fees.monthly}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="bg-blue-600 dark:bg-blue-900">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-6">
              Academic Excellence
            </h3>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our students consistently achieve outstanding results, demonstrating academic excellence and dedication to learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultsData.map((result, index) => (
              <Card key={index} className="bg-white/10 border-white/20 text-white">
                <CardHeader className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">#{result.rank}</div>
                  <CardTitle className="text-xl">{result.name}</CardTitle>
                  <CardDescription className="text-blue-100">Grade {result.grade}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{result.percentage}%</div>
                  <div className="text-blue-100">Percentage</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Information
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-2xl">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Address</h4>
                  <p className="text-gray-600 dark:text-gray-300">{contactInfo.address}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Phone</h4>
                  {contactInfo.phone.map((phone, index) => (
                    <p key={index} className="text-gray-600 dark:text-gray-300">{phone}</p>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Email</h4>
                  {contactInfo.email.map((email, index) => (
                    <p key={index} className="text-gray-600 dark:text-gray-300">{email}</p>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Office Hours</h4>
                  <p className="text-gray-600 dark:text-gray-300">{contactInfo.hours}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-2xl">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Admissions</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      Ready to join Excel Academy? Start your admission process today.
                    </p>
                    <Button variant="outline" size="sm">
                      Apply Now
                    </Button>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Academic Calendar</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      View important dates, holidays, and exam schedules.
                    </p>
                    <Button variant="outline" size="sm">
                      View Calendar
                    </Button>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Student Portal</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      Access grades, assignments, and school resources.
                    </p>
                    <Button variant="outline" size="sm">
                      Login Portal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      <section id="auth-section" className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription>
                Sign up for a new school or sign in to your existing account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4" variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      data-testid="input-login-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        data-testid="input-login-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setError('');
                      if (!loginData.email || !loginData.password) {
                        setError('Please fill in all fields');
                        return;
                      }
                      login(loginData);
                    }}
                    disabled={isLoggingIn}
                    data-testid="button-login-submit"
                  >
                    {isLoggingIn ? 'Signing In...' : 'Sign In'}
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstName">First Name</Label>
                      <Input
                        id="signup-firstName"
                        placeholder="First name"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        data-testid="input-signup-firstname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastName">Last Name</Label>
                      <Input
                        id="signup-lastName"
                        placeholder="Last name"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        data-testid="input-signup-lastname"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      data-testid="input-signup-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-schoolName">School Name</Label>
                    <Input
                      id="signup-schoolName"
                      placeholder="Enter your school name"
                      value={signupData.schoolName}
                      onChange={(e) => setSignupData({ ...signupData, schoolName: e.target.value })}
                      data-testid="input-signup-schoolname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        data-testid="input-signup-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setError('');
                      if (!signupData.email || !signupData.password || !signupData.firstName || !signupData.lastName || !signupData.schoolName) {
                        setError('Please fill in all fields');
                        return;
                      }
                      signup(signupData);
                    }}
                    disabled={isSigningUp}
                    data-testid="button-signup-submit"
                  >
                    {isSigningUp ? 'Creating Account...' : 'Create School Account'}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your School?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of schools that have modernized their management with EduConnect.
          </p>
          <Button size="lg" onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-start-trial">
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 EduConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
