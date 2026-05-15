import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

interface TabsContentProps {
  value: string;
  activeValue?: string;
  children: React.ReactNode;
  className?: string;
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as Record<string, unknown>;
      if (child.type === TabsList) {
        const listChildren = React.Children.map(
          childProps.children,
          (trigger) => {
            if (React.isValidElement(trigger) && trigger.type === TabsTrigger) {
              const triggerProps = trigger.props as Record<string, unknown>;
              return React.cloneElement(trigger, {
                active: triggerProps.value === value,
                onClick: () => onValueChange(triggerProps.value as string),
              } as Partial<TabsTriggerProps>);
            }
            return trigger;
          }
        );
        return React.cloneElement(child, {} as Record<string, unknown>, listChildren as React.ReactNode[]);
      }
      if (child.type === TabsContent) {
        return React.cloneElement(child, {
          activeValue: value,
        } as Partial<TabsContentProps>);
      }
    }
    return child;
  });

  return <div className={cn("w-full", className)}>{childrenWithProps}</div>;
}

function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex w-full items-center gap-1 rounded-xl border border-border bg-secondary p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

function TabsTrigger({
  children,
  className,
  active,
  onClick,
}: TabsTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all",
        active
          ? "bg-primary/20 text-primary shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

function TabsContent({
  children,
  activeValue,
  value,
  className,
}: TabsContentProps) {
  if (activeValue !== undefined && activeValue !== value) return null;
  return <div className={cn("mt-4", className)}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
