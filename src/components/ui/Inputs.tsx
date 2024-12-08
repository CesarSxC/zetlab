// inputs.tsx
import React from 'react';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  name?: string;
  id?: string;
  className?: string;
}

const Inputs: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  name,
  id,
  className
}) => {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      name={name}
      id={id}
      className={`block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 ${className}`}
    />
  );
};

export default Inputs;