import { ThemeProvider } from '../ThemeProvider';

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">Theme Provider</h3>
        <p className="text-muted-foreground">This provider manages the application theme state.</p>
      </div>
    </ThemeProvider>
  );
}