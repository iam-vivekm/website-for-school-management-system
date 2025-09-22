import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '../ThemeProvider';

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-medium">Theme Toggle</h3>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}