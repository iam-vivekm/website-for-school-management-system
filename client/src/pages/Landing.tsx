import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, BarChart3, DollarSign, Bell } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Users,
      title: "Student & Teacher Management",
      description: "Comprehensive profiles, enrollment tracking, and staff management with role-based access."
    },
    {
      icon: BookOpen,
      title: "Academic Management",
      description: "Class scheduling, grade management, and curriculum tracking in one integrated system."
    },
    {
      icon: BarChart3,
      title: "Attendance Tracking",
      description: "Daily attendance monitoring with automated reports and parent notifications."
    },
    {
      icon: DollarSign,
      title: "Fee Management",
      description: "Online payment processing, fee structure setup, and automated receipts."
    },
    {
      icon: Bell,
      title: "Communication System", 
      description: "School-wide announcements, parent notifications, and messaging system."
    },
    {
      icon: GraduationCap,
      title: "Multi-School Support",
      description: "Manage multiple school branches with custom branding and isolated data."
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
            <Button variant="outline" onClick={() => window.location.href = '/api/signup'} data-testid="button-signup">
              Sign Up
            </Button>
            <Button onClick={() => window.location.href = '/api/login'} data-testid="button-login">
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
            <Button size="lg" onClick={() => window.location.href = '/api/signup'} data-testid="button-get-started">
              Get Started Today
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/api/login'} data-testid="button-learn-more">
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your School?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of schools that have modernized their management with EduConnect.
          </p>
          <Button size="lg" onClick={() => window.location.href = '/api/signup'} data-testid="button-start-trial">
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
