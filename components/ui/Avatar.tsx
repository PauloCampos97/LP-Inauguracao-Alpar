import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: "sm" | "md" | "lg";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

function Avatar({ name, size = "md", className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 font-semibold text-white ring-2 ring-indigo-500/30",
        sizeClasses[size],
        className
      )}
      title={name}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
}

export { Avatar };
