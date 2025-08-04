import { Input, InputProps } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function PasswordInput(props: InputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      {...props}
      endContent={
        <button type="button" onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? <EyeOff /> : <Eye />}
        </button>
      }
      type={isVisible ? "text" : "password"}
    />
  );
}
