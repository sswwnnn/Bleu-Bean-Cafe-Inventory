import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";

import { cn } from "@/lib/utils";

// Component for OTP input field
const InputOTP = React.forwardRef(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
);
InputOTP.displayName = "InputOTP"; // Display name for debugging

// Grouping component for OTP input fields
const InputOTPGroup = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center", className)} {...props} />
  )
);
InputOTPGroup.displayName = "InputOTPGroup"; // Display name for debugging

// Slot component for each individual OTP input slot
const InputOTPSlot = React.forwardRef(
  ({ index, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext); // Accesses the OTP context
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]; // Gets the relevant slot data

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
          isActive && "z-10 ring-2 ring-ring ring-offset-background", // Applies active state styling
          className
        )}
        {...props}
      >
        {char} {/* Displays the character */}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
          </div>
        )}
      </div>
    );
  }
);
InputOTPSlot.displayName = "InputOTPSlot"; // Display name for debugging

// Separator component, typically used between OTP slots
const InputOTPSeparator = React.forwardRef(
  ({ ...props }, ref) => (
    <div ref={ref} role="separator" {...props}>
      <Dot /> {/* A dot icon to represent the separator */}
    </div>
  )
);
InputOTPSeparator.displayName = "InputOTPSeparator"; // Display name for debugging

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }; // Exporting components

