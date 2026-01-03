import { cn } from "../../lib/utils";

export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-xl shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div
      className={cn("px-6 py-4 border-b border-slate-200", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div
      className={cn("px-6 py-4 border-t border-slate-200", className)}
      {...props}
    >
      {children}
    </div>
  );
}