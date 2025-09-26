# Images Folder

This folder contains static images for the EduConnect school management system.

## Usage

Place your image files in this folder and reference them in React components like this:

```jsx
import logo from '/images/logo.png';
import schoolIcon from '/images/school-icon.png';

// Or directly in JSX
<img src="/images/logo.png" alt="School Logo" />
<img src="/images/school-icon.png" alt="School Icon" />
```

## Recommended Images

- `logo.png` - School logo (200x60px recommended)
- `favicon.ico` - Browser favicon
- `school-icon.png` - App icon (512x512px for PWA)
- `background.jpg` - Landing page background
- `avatar-placeholder.png` - Default user avatar

## File Formats

- **PNG**: For logos, icons, and images with transparency
- **JPG/JPEG**: For photos and backgrounds
- **SVG**: For scalable icons and logos
- **ICO**: For favicons

## Optimization

- Keep file sizes small (< 500KB per image)
- Use appropriate compression
- Consider WebP format for better performance
- Use responsive images when possible

## Example Component Usage

```jsx
import { Card, CardContent } from "@/components/ui/card";

export function SchoolHeader() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <img
          src="/images/logo.png"
          alt="School Logo"
          className="h-12 w-auto"
        />
        <div>
          <h1 className="text-2xl font-bold">EduConnect</h1>
          <p className="text-muted-foreground">School Management System</p>
        </div>
      </CardContent>
    </Card>
  );
}
