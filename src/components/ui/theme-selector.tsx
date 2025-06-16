
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette, Sun, Moon, Monitor } from "lucide-react";

interface ThemeSelectorProps {
  variant?: 'dropdown' | 'buttons';
  showLabel?: boolean;
  className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  variant = 'dropdown',
  showLabel = true,
  className = '',
}) => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-1 ${className}`}>
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <Button
              key={themeOption.id}
              variant={theme === themeOption.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme(themeOption.id)}
            >
              <Icon className="h-4 w-4" />
              {showLabel && <span className="ml-1">{themeOption.label}</span>}
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Palette className="h-4 w-4" />
          {showLabel && <span className="ml-1">Theme</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {themeOption.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
