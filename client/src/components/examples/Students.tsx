import Students from '@/pages/Students';
import { ThemeProvider } from '../ThemeProvider';

export default function StudentsExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Students />
      </div>
    </ThemeProvider>
  );
}