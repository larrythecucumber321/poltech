import { ButtonHTMLAttributes, forwardRef, ElementType } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: ElementType;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, as: Component = "button", ...props }, ref) => {
    return (
      <Component
        className={cn(
          "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-dark",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = "Button";

export { Button };
