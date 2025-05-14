import React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * ThemeToggle component
 * 
 * A dropdown menu that allows users to switch between light, dark, and system themes.
 * The icon changes based on the current theme.
 */
export function ThemeToggle({ className, variant = "outline", size = "icon" }: ThemeToggleProps) {
  const { theme, setTheme, isDarkMode } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={cn(
            "relative overflow-hidden transition-colors",
            className
          )}
          aria-label="Toggle theme"
        >
          {/* Sun icon for light theme */}
          <Sun 
            className={cn(
              "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all",
              theme === "dark" || (theme === "system" && isDarkMode) 
                ? "opacity-0" 
                : "opacity-100"
            )} 
          />
          
          {/* Moon icon for dark theme */}
          <Moon 
            className={cn(
              "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all",
              theme === "dark" || (theme === "system" && isDarkMode) 
                ? "rotate-0 scale-100 opacity-100" 
                : "opacity-0"
            )} 
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "light" && "font-medium"
          )}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "dark" && "font-medium"
          )}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "system" && "font-medium"
          )}
        >
          <Laptop className="h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * ThemeToggleSimple component
 * 
 * A simpler version of the theme toggle that just toggles between light and dark modes.
 */
export function ThemeToggleSimple({ className, variant = "outline", size = "icon" }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={toggleTheme}
      className={cn(
        "relative overflow-hidden transition-colors",
        className
      )}
      aria-label="Toggle theme"
    >
      {/* Sun icon for light theme */}
      <Sun 
        className={cn(
          "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all",
          isDarkMode ? "opacity-0" : "opacity-100"
        )} 
      />
      
      {/* Moon icon for dark theme */}
      <Moon 
        className={cn(
          "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all",
          isDarkMode ? "rotate-0 scale-100 opacity-100" : "opacity-0"
        )} 
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
