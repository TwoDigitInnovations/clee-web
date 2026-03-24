import React from "react";

const TextareaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
}) => {
  return (
    <div className="col-span-2">
      {label && (
        <label className="block text-sm font-medium mb-2 text-black">
          {label}
        </label>
      )}

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full text-[14px] px-4 py-2 bg-[#F8FAFC] text-black rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none resize-none`}
      />

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TextareaField;
