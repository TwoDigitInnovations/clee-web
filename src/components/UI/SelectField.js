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
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {/* {error && <p className="text-red-400 text-sm mt-1">{error}</p>} */}
    </div>
  );
};

export default SelectField;
