import React, { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({ 
  label,
  options = [],
  error,
  helperText,
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const selectClasses = `
    w-full px-3 py-2 text-sm border rounded-lg transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    disabled:bg-surface-50 disabled:text-surface-500 disabled:cursor-not-allowed
    appearance-none bg-white pr-10
    ${error ? 'border-error focus:ring-error focus:border-error' : 'border-surface-300'}
    ${className}
  `;

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ApperIcon name="ChevronDown" size={16} className="text-surface-400" />
        </div>
      </div>
      
      {(error || helperText) && (
        <p className={`text-xs ${error ? 'text-error' : 'text-surface-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;