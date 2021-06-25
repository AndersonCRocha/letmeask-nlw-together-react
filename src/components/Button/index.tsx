import { ButtonHTMLAttributes } from "react";

import "../../styles/button.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isOutlined?: boolean;
}

export function Button({
  isOutlined = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button ${isOutlined ? "outlined" : ""} ${className}`}
      {...props}
    />
  );
}
