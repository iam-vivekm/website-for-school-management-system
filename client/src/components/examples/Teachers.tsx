import Teachers from '@/pages/Teachers';
import { ThemeProvider } from '../ThemeProvider';

export default function TeachersExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Teachers />
      </div>
    </ThemeProvider>
  );
}