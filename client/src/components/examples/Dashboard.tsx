import Dashboard from '@/pages/Dashboard';
import { ThemeProvider } from '../ThemeProvider';

export default function DashboardExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}