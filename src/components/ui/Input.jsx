import React from 'react';

export function Input({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}) {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`
            block w-full rounded-lg bg-slate-900/90 border border-slate-700/80 
            text-slate-100 placeholder-slate-500 text-sm 
            focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none 
            transition-colors duration-150 py-2.5
            ${Icon ? 'pl-9.5 pr-3' : 'px-3'}
            ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-400 mt-1">{error}</p>
      )}
    </div>
  );
}
