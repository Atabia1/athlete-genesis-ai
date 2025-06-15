
import React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * ThemeSelector component
 * 
 * A dropdown menu that allows users to switch between light, dark, and system themes.
 * Uses the theme provider for state management.
 */
export function ThemeSelector({ 
  className, 
  variant = "outline", 
  size = "icon" 
}: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={cn(
            "relative overflow-hidden transition-colors bg-background hover:bg-accent",
            className
          )}
          aria-label="Toggle theme"
        >
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[140px] bg-popover border border-border shadow-lg"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-2 cursor-pointer text-popover-foreground hover:bg-accent hover:text-accent-foreground",
            theme === "light" && "font-medium bg-accent text-accent-foreground"
          )}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-2 cursor-pointer text-popover-foreground hover:bg-accent hover:text-accent-foreground",
            theme === "dark" && "font-medium bg-accent text-accent-foreground"
          )}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-2 cursor-pointer text-popover-foreground hover:bg-accent hover:text-accent-foreground",
            theme === "system" && "font-medium bg-accent text-accent-foreground"
          )}
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeSelector;
