// import { LoaderWithThreeDots } from 'components/common/storybook/Loaders/LoaderWthThreeDots';
import React, { ButtonHTMLAttributes, FC, useRef, useState } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "custom";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "full";
type IconPosition = "left" | "right";
type LoaderColor = "white" | "black";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick: (...args: any[]) => void | Promise<void>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  loaderColor?: LoaderColor;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
}

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant,
  size,
  className,
  loaderColor,
  icon,
  iconPosition = "left",
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef(null);
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    await onClick();
    setLoading(false);
  };

  const buttonClass = () => {
    let classes = `flex items-center justify-center rounded gap-1.5 ${className} `;
    switch (variant) {
      case "primary":
        classes +=
          "bg-black rounded border border-zinc-950 text-gray-100 hover:shadow";
        break;
      case "secondary":
        classes += "rounded border border-gray-200 text-gray-700 hover:shadow";
        break;
      case "danger":
        classes += "";
        break;
      default:
        classes += "";
    }

    switch (size) {
      case "xs":
        classes += " md:min-w-[120px] px-3 md:h-10 text-xs ";
        break;
      case "sm":
        classes += " min-w-[180px] px-4 h-10 text-sm ";
        break;
      case "md":
        classes += " ";
        break;
      case "lg":
      default:
        classes += " ";
        break;
      case "full":
        classes += " w-full px-4 h-10 text-base ";
        break;
    }
    classes += className;
    return classes.trim();
  };

  return (
    <button
      className={buttonClass()}
      type="button"
      onClick={handleClick}
      disabled={loading}
      {...props}
      ref={buttonRef}
    >
      {loading ? (
        <div className="mx-auto">
          {/* <LoaderWithThreeDots color={loaderColor} /> */}
        </div>
      ) : (
        <>
          {iconPosition === "left" ? icon : null}
          {children}
          {iconPosition === "right" ? icon : null}
        </>
      )}
    </button>
  );
};

Button.defaultProps = {
  variant: "primary",
  size: "full",
  className: "",
  loaderColor: "white",
  iconPosition: "left",
};

export default Button;

/*
Remove Twice Condition for Icon use CSS flex-row-revers and flex-row for the better coding

*/
