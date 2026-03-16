import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantMap: Record<string, string> = {
  primary: 'btn-gold', secondary: 'btn-ghost', danger: 'btn-danger', success: 'btn-ghost', ghost: 'btn-ghost',
};
const sizeMap: Record<string, string> = { xs: 'btn-xs', sm: 'btn-sm', md: '', lg: 'btn-lg' };

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', isLoading, disabled, children, className = '', ...props
}) => (
  <button disabled={disabled || isLoading} className={`btn ${variantMap[variant]} ${sizeMap[size]} ${className}`} {...props}>
    {isLoading ? <><span className="spinner" style={{ width: 12, height: 12 }} />กำลังดำเนินการ...</> : children}
  </button>
);