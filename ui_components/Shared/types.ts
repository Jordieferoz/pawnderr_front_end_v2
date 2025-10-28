import { ChangeEvent } from 'react';

export interface IInputFieldProps {
  type?: string;
  name?: string;
  label?: string | React.ReactElement;
  labelClassName?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  id?: string;
  error?: boolean;
  value?: string | number;
  errorMsg?: string | React.ReactElement;
  autoComplete?: 'on' | 'off';
  autofocus?: boolean;
  disabled?: boolean;
  isPassword?: boolean;
  rightIcon?: string;
  maxLength?: number;
}
