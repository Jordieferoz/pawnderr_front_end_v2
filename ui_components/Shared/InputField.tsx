import { FC, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Input } from '@/components/ui/input';

import { Label } from '../../components/ui/label';

import { IInputFieldProps } from './types';

const InputField: FC<IInputFieldProps> = (props) => {
  const {
    label,
    labelClassName,
    type,
    className,
    name,
    id,
    placeholder,
    value,
    onChange,
    onBlur,
    errorMsg,
    autofocus,
    disabled,
    isPassword,
    rightIcon,
    maxLength,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex flex-col gap-3">
      {label && (
        <Label htmlFor={id} className={`paragraph1 ${labelClassName || ''}`}>
          {label}
        </Label>
      )}

      <div className="relative">
        <Input
          type={isPassword && showPassword ? 'text' : type}
          id={id}
          name={name}
          className={`${className ?? ''} ${rightIcon ? 'pr-12' : ''} pr-10`}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          onBlur={onBlur}
          value={value as string | number}
          autoFocus={autofocus}
          autoComplete="off"
          maxLength={maxLength}
        />
        {rightIcon && (
          <img
            src={rightIcon}
            className="absolute top-1/2 right-6 z-10 h-4 w-4 -translate-y-1/2"
          />
        )}
        {isPassword && (
          <button
            type="button"
            className="text-blue absolute top-1/2 right-6 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Eye className="w-4" />
            ) : (
              <EyeOff className="w-4" />
            )}
          </button>
        )}
      </div>
      {errorMsg && <span className="supportText text-red-500">{errorMsg}</span>}
    </div>
  );
};

export default InputField;
