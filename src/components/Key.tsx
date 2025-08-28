import React from "react";

export interface KeyProps {
    children: React.ReactNode;
    size?: string; // sm, md, lg
    variant?: string; // default, primary, secondary, success, warning, error
    isPressed?: boolean;
}

const defaultProps = {
    size: 'md',
    variant: 'default',
    isPressed: false,
}

const Key: React.FunctionComponent<KeyProps> = (props: KeyProps) => {
    props = {
        ...defaultProps,
        ...props,
    }

    // Size classes
    const sizeClasses: Record<string, string> = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    };

    // Variant classes
    const variantClasses: Record<string, string> = {
        default: 'bg-gray-200 text-gray-900 border-gray-300',
        primary: 'bg-blue-200 text-blue-900 border-blue-300',
        secondary: 'bg-purple-200 text-purple-900 border-purple-300',
        success: 'bg-green-200 text-green-900 border-green-300',
        warning: 'bg-yellow-200 text-yellow-900 border-yellow-300',
        error: 'bg-red-200 text-red-900 border-red-300'
    };

    // Pressed state classes
    const pressedClasses = props.isPressed
        ? 'transform translate-y-0.5 shadow-inner'
        : 'shadow-sm hover:shadow-md';

    return (
        <span
            className={`
        inline-flex items-center justify-center 
        rounded-md font-medium
        border border-b-2
        transition-all duration-75 ease-in-out
        cursor-default
        ${sizeClasses[props.size!]}
        ${variantClasses[props.variant!]}
        ${pressedClasses}
      `}
            {...props}
        >
      {props.children}
    </span>
    );
};

export default Key;