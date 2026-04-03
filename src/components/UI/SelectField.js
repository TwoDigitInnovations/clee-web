import React from "react";

const SelectField = ({ label, name, value, onChange, options}) => {
  return (
    <div className="md:col-span-1 col-span-2">
      {label && (
        <label className="block text-sm font-medium mb-2 text-black">
          {label}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full text-[14px] px-4 py-2 bg-[#F8FAFC] text-black rounded-lg border border-gray-200 focus:outline-none  cursor-pointer`}
      >
        {options.map((opt, i) => {
          // Support both string and object format
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          
          return (
            <option key={i} value={i === 0 ? "" : optValue} disabled={i === 0}>
              {optLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectField;
