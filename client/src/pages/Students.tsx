import { StudentsTable } from "@/components/StudentsTable";

export default function Students() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">
          Manage student records, attendance, and academic performance.
        </p>
      </div>
      
      <StudentsTable />
    </div>
  );
}