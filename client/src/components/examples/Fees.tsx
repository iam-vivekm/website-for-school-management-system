import Fees from '@/pages/Fees';
import { ThemeProvider } from '../ThemeProvider';

export default function FeesExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Fees />
      </div>
    </ThemeProvider>
  );
}