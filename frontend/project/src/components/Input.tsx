import React from 'react';

interface InputProps {
    type: string;
    name: string;
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    step?: string;
}

const Input: React.FC<InputProps> = ({ type, name, label, value, onChange, step }) => {
    return (
        <div className="flex flex-col text-left w-full mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-800 mb-1 text-left">
                {label}
            </label>
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                step={step}
                onChange={onChange}
                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-gray-400 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition"
            />
        </div>
    );
};

export default Input;