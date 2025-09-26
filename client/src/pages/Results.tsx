import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GraduationCap, Search, Download, Trophy, Medal, Award } from "lucide-react";
import { useState } from "react";

export default function Results() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");

  // Dummy results data
  const results = [
    {
      id: "1",
      studentName: "Alice Johnson",
      rollNumber: "S001",
      class: "10",
      section: "A",
      totalMarks: 485,
      percentage: 97.0,
      grade: "A+",
      status: "Pass",
      subjects: {
        Mathematics: 98,
        English: 95,
        Science: 97,
        SocialStudies: 94,
        Hindi: 96,
        ComputerScience: 99
      }
    },
    {
      id: "2",
      studentName: "Bob Williams",
      rollNumber: "S002",
      class: "10",
      section: "A",
      totalMarks: 472,
      percentage: 94.4,
      grade: "A+",
      status: "Pass",
      subjects: {
        Mathematics: 92,
        English: 94,
        Science: 95,
        SocialStudies: 93,
        Hindi: 95,
        ComputerScience: 98
      }
    },
    {
      id: "3",
      studentName: "Charlie Brown",
      rollNumber: "S003",
      class: "10",
      section: "B",
      totalMarks: 458,
      percentage: 91.6,
      grade: "A",
      status: "Pass",
      subjects: {
        Mathematics: 88,
        English: 92,
        Science: 93,
        SocialStudies: 91,
        Hindi: 94,
        ComputerScience: 96
      }
    },
    {
      id: "4",
      studentName: "Diana Davis",
      rollNumber: "S004",
      class: "9",
      section: "A",
      totalMarks: 445,
      percentage: 89.0,
      grade: "A",
      status: "Pass",
      subjects: {
        Mathematics: 85,
        English: 90,
        Science: 91,
        SocialStudies: 88,
        Hindi: 92,
        ComputerScience: 94
      }
    },
    {
      id: "5",
      studentName: "Eva Miller",
      rollNumber: "S005",
      class: "9",
      section: "B",
      totalMarks: 432,
      percentage: 86.4,
      grade: "B+",
      status: "Pass",
      subjects: {
        Mathematics: 82,
        English: 87,
        Science: 89,
        SocialStudies: 85,
        Hindi: 90,
        ComputerScience: 92
      }
    }
  ];

  const topPerformers = [
    { name: "Alice Johnson", percentage: 97.0, grade: "A+", position: 1 },
    { name: "Bob Williams", percentage: 94.4, grade: "A+", position: 2 },
    { name: "Charlie Brown", percentage: 91.6, grade: "A", position: 3 }
  ];

  const filteredResults = results.filter(result => {
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !selectedClass || result.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800';
      case 'A': return 'bg-blue-100 text-blue-800';
      case 'B+': return 'bg-yellow-100 text-yellow-800';
      case 'B': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return null;
    }
  };

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
            <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
            <a href="/admission" className="text-gray-600 hover:text-blue-600 transition-colors">Admission</a>
            <a href="/results" className="text-blue-600 font-medium">Results</a>
            <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Academic <span className="text-blue-600">Results</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            View examination results and performance reports for {selectedYear}.
            Our students consistently achieve excellent results across all grades.
          </p>
        </div>
      </section>

      {/* Top Performers */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Top Performers - {selectedYear}
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {topPerformers.map((performer, index) => (
            <Card key={index} className="hover-elevate text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {getPositionIcon(performer.position)}
                </div>
                <CardTitle className="text-xl">{performer.name}</CardTitle>
                <CardDescription>Rank #{performer.position}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {performer.percentage}%
                </div>
                <Badge className={getGradeColor(performer.grade)}>
                  Grade {performer.grade}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Results Table */}
      <section className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Examination Results - {selectedYear}</CardTitle>
            <CardDescription>
              Complete results for all classes and sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="search">Search Students</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="class">Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Classes</SelectItem>
                    <SelectItem value="9">Class 9</SelectItem>
                    <SelectItem value="10">Class 10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.rollNumber}</TableCell>
                      <TableCell>{result.studentName}</TableCell>
                      <TableCell>{result.class}-{result.section}</TableCell>
                      <TableCell>{result.totalMarks}/500</TableCell>
                      <TableCell>{result.percentage}%</TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(result.grade)}>
                          {result.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={result.status === 'Pass' ? 'default' : 'destructive'}>
                          {result.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No results found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Statistics */}
      <section className="bg-blue-600 dark:bg-blue-900">
        <div className="container mx-auto px-4 py-20 text-center text-white">
          <h3 className="text-3xl font-bold mb-12">Class-wise Performance - {selectedYear}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">98%</div>
              <p className="text-blue-100">Overall Pass Rate</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">92.5%</div>
              <p className="text-blue-100">Average Percentage</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">85+</div>
              <p className="text-blue-100">Students with A Grade</p>
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
