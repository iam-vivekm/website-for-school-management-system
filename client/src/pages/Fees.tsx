import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, DollarSign, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";

interface FeeRecord {
  id: string;
  studentName: string;
  studentId: string;
  grade: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: "paid" | "partial" | "overdue" | "pending";
  lastPayment?: string;
}

export default function Fees() {
  const [searchTerm, setSearchTerm] = useState("");
  
  //todo: remove mock functionality
  const feeRecords: FeeRecord[] = [
    {
      id: "1",
      studentName: "Emily Johnson",
      studentId: "STU001",
      grade: "Grade 10",
      totalAmount: 1200,
      paidAmount: 1200,
      dueDate: "2024-01-15",
      status: "paid",
      lastPayment: "2024-01-10"
    },
    {
      id: "2",
      studentName: "Michael Brown",
      studentId: "STU002", 
      grade: "Grade 10",
      totalAmount: 1200,
      paidAmount: 600,
      dueDate: "2024-01-15",
      status: "partial",
      lastPayment: "2023-12-15"
    },
    {
      id: "3",
      studentName: "Sarah Davis",
      studentId: "STU003",
      grade: "Grade 9",
      totalAmount: 1100,
      paidAmount: 0,
      dueDate: "2024-01-10",
      status: "overdue"
    },
    {
      id: "4",
      studentName: "David Wilson",
      studentId: "STU004",
      grade: "Grade 11",
      totalAmount: 1300,
      paidAmount: 0,
      dueDate: "2024-01-20",
      status: "pending"
    },
  ];

  const getStatusBadge = (status: FeeRecord["status"]) => {
    switch (status) {
      case "paid": 
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />Paid
        </Badge>;
      case "partial": 
        return <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />Partial
        </Badge>;
      case "overdue": 
        return <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />Overdue
        </Badge>;
      default: 
        return <Badge variant="outline">
          <Clock className="h-3 w-3 mr-1" />Pending
        </Badge>;
    }
  };

  const getPaymentProgress = (paidAmount: number, totalAmount: number) => {
    return (paidAmount / totalAmount) * 100;
  };

  const filteredRecords = feeRecords.filter(record =>
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary stats
  const totalCollected = feeRecords.reduce((sum, record) => sum + record.paidAmount, 0);
  const totalPending = feeRecords.reduce((sum, record) => sum + (record.totalAmount - record.paidAmount), 0);
  const collectionRate = (totalCollected / (totalCollected + totalPending)) * 100;
  const overdueCount = feeRecords.filter(r => r.status === "overdue").length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
        <p className="text-muted-foreground">
          Track fee collection, payments, and outstanding balances.
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This academic term</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
            <Progress value={collectionRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Accounts</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Fee Records Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fee Records</CardTitle>
              <CardDescription>
                Detailed view of all student fee payments and outstanding amounts
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => console.log('Export clicked')} data-testid="button-export-fees">
                Export Report
              </Button>
              <Button onClick={() => console.log('Send reminders clicked')} data-testid="button-send-reminders">
                Send Reminders
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, ID, or grade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                data-testid="input-search-fees"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Student</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Total Fee</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Paid Amount</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Progress</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Due Date</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b hover-elevate">
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium" data-testid={`fee-student-${record.id}`}>
                          {record.studentName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {record.studentId} • {record.grade}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono">${record.totalAmount}</td>
                    <td className="py-3 px-2 font-mono">${record.paidAmount}</td>
                    <td className="py-3 px-2">
                      <div className="w-full">
                        <Progress value={getPaymentProgress(record.paidAmount, record.totalAmount)} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {getPaymentProgress(record.paidAmount, record.totalAmount).toFixed(0)}%
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {new Date(record.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => console.log(`Process payment for ${record.id}`)}
                          data-testid={`button-payment-${record.id}`}
                        >
                          Process Payment
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => console.log(`View details for ${record.id}`)}
                          data-testid={`button-details-${record.id}`}
                        >
                          Details
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
    </div>
  );
}