// components/common/CompactNumberInput.tsx
import React, { useState, useEffect, useRef, memo } from 'react';

export const CompactNumberInput: React.FC<{
  id: string;
  visualLabel: string; 
  value: number | null; // Updated to allow null
  onChange: (value: number | null) => void; // Updated to allow null
  placeholder?: string;
  min?: number | undefined; // Updated to allow undefined (no min constraint)
  inputClassName?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  disabled?: boolean; 
  onClick?: () => void;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
}> = memo(({ id, visualLabel, value, onChange, placeholder, min, inputClassName = "w-20", labelClassName = "text-sm font-medium text-gray-700 mr-1", wrapperClassName = "", disabled = false, onClick, inputMode = "numeric" }) => {
  const [displayValue, setDisplayValue] = useState<string>((value ?? '').toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stringValue = (value ?? '').toString();
    if (inputRef.current !== document.activeElement || value === null) {
      if (stringValue !== displayValue) {
        setDisplayValue(stringValue);
      }
    }
  }, [value, displayValue]);

  const handleBlur = () => {
    if (disabled) return;
    if (displayValue.trim() === "") {
      if (value !== null) onChange(null);
      return;
    }
    if (displayValue.trim() === "-") { // Allow just "-" to be typed, then cleared on blur if no number follows
        if (value !== null) onChange(null);
        setDisplayValue(""); // Clear the standalone "-"
        return;
    }

    let numericValue = parseInt(displayValue, 10);

    if (isNaN(numericValue)) {
        if (value !== null) onChange(null);
        setDisplayValue((value ?? '').toString()); // Revert to last valid or empty
        return;
    }
    
    if (min !== undefined && numericValue < min) { 
        numericValue = min;
    }
    
    const newDisplayValue = numericValue.toString();
    if (newDisplayValue !== displayValue) {
        setDisplayValue(newDisplayValue);
    }
    
    if (numericValue !== value) {
        onChange(numericValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newDisplayValue = e.target.value;
    setDisplayValue(newDisplayValue); 

    if (newDisplayValue.trim() === "") {
        if (value !== null) onChange(null);
        return;
    }
    if (newDisplayValue === "-") { // Allow typing minus sign
        // Don't call onChange yet, wait for number or blur
        return;
    }

    if (/^-?[0-9]*$/.test(newDisplayValue)) {
        const numericValue = parseInt(newDisplayValue, 10);
        if (!isNaN(numericValue)) {
            if (numericValue !== value) { // also handles case where value was null
                 onChange(numericValue);
            }
        } else if (newDisplayValue.trim() !== "" && value !== null) { 
            // If it becomes NaN but wasn't empty (e.g. "--", "-abc") and previous wasn't null
            onChange(null);
        } else if (newDisplayValue.trim() !== "" && isNaN(numericValue)) {
             // If it's a non-empty NaN string (like "-a") and value was null, keep it as null.
             // No change needed to 'value' if it's already null.
        }
    } else { // Invalid characters entered (e.g., letters not part of "-")
      // Revert displayValue to previous valid 'value' (or empty if value was null)
      // This part might be too aggressive, consider removing if it causes issues with typing.
      // For now, let's allow typing and handle on blur or further input.
      // Or, better, just don't call onChange if it's not a valid intermediate or final number.
    }
  };
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (disabled) return;
    inputRef.current?.select(); 
  };

  return (
    <div className={`flex items-center ${wrapperClassName}`} onClick={onClick}>
      <label htmlFor={id} className={labelClassName}>{visualLabel}</label>
      <input
        ref={inputRef} 
        type="text" 
        id={id}
        name={id}
        value={displayValue} 
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={`p-1 bg-slate-50 border border-sky-300 rounded-md shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-gray-800 text-sm ${inputClassName} ${disabled ? 'disabled:bg-slate-200 disabled:text-slate-400 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-label={`${visualLabel} count`}
        disabled={disabled} 
      />
    </div>
  );
});
CompactNumberInput.displayName = 'CompactNumberInput';