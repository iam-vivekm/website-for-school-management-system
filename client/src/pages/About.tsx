import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, BookOpen, Trophy, Target, Heart } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: GraduationCap,
      title: "Academic Excellence",
      description: "Committed to providing quality education with modern teaching methodologies and experienced faculty."
    },
    {
      icon: Users,
      title: "Student-Centered Learning",
      description: "Individual attention to each student with personalized learning plans and regular assessments."
    },
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description: "CBSE affiliated curriculum with additional co-curricular activities and skill development programs."
    },
    {
      icon: Trophy,
      title: "Sports & Activities",
      description: "State-of-the-art sports facilities and various clubs for holistic development of students."
    },
    {
      icon: Target,
      title: "Career Guidance",
      description: "Professional counseling and career guidance to help students choose the right path."
    },
    {
      icon: Heart,
      title: "Values & Ethics",
      description: "Emphasis on character building, moral values, and social responsibility."
    }
  ];

  const stats = [
    { label: "Years of Excellence", value: "25+" },
    { label: "Students", value: "2000+" },
    { label: "Teachers", value: "80+" },
    { label: "Pass Rate", value: "98%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-gray-900 dark:to-blue-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NMS International School</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="/about" className="text-blue-600 font-medium">About</a>
            <a href="/admission" className="text-gray-600 hover:text-blue-600 transition-colors">Admission</a>
            <a href="/results" className="text-gray-600 hover:text-blue-600 transition-colors">Results</a>
            <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="text-blue-600">NMS International School</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Established in 1999, NMS International School has been a beacon of educational excellence,
            nurturing young minds and shaping future leaders for over two decades.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                To be a premier educational institution that empowers students with knowledge,
                skills, and values to become responsible global citizens and leaders in their chosen fields.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                To provide holistic education that fosters academic excellence, character development,
                and lifelong learning skills through innovative teaching methods and comprehensive programs.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-blue-600 dark:bg-blue-900">
        <div className="container mx-auto px-4 py-20 text-center text-white">
          <h3 className="text-3xl font-bold mb-12">Our Achievements</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-100 mb-2">{stat.value}</div>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose NMS?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We offer a comprehensive educational experience that goes beyond academics
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

      {/* Principal's Message */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Message from the Principal
            </h3>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 italic">
                "At NMS International School, we believe that education is not just about academic excellence,
                but about nurturing the complete development of each child. Our dedicated faculty and
                comprehensive curriculum ensure that every student receives the guidance and support they
                need to achieve their full potential."
              </p>
              <div className="font-semibold text-blue-600">
                Dr. Sarah Johnson
              </div>
              <div className="text-gray-500">
                Principal, NMS International School
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 NMS International School. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
