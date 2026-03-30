import React, { useState } from "react";
import { X, Check } from "lucide-react";

const ResourceSettingsModal = ({ isOpen, onClose, onSave }) => {
  const [isChecked, setIsChecked] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden ">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-custom-blue text-xl font-bold">Resource settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-slate-800 font-bold text-base mb-1">
              Minimise resource switching
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Optimize your scheduling flow by keeping services linked to consistent resources.
            </p>
          </div>

          {/* Checkbox Card */}
          <div 
            onClick={() => setIsChecked(!isChecked)}
            className="flex items-start gap-4 p-5 border border-gray-100 rounded-xl bg-white shadow-sm cursor-pointer hover:border-blue-200 transition-all"
          >
            <div className={`mt-1 flex items-center justify-center w-5 h-5 rounded border transition-colors ${
              isChecked ? "bg-custom-blue border-custom-blue" : "border-gray-300 bg-white"
            }`}>
              {isChecked && <Check size={14} className="text-white stroke-[3]" />}
            </div>
            
            <div className="flex-1">
              <p className="text-slate-700 font-semibold text-sm">
                Match resources in a booking containing multiple services
              </p>
              <p className="text-slate-400 text-[12px] mt-1 italic">
                (Will apply to services booked online that can use the same resource)
              </p>
            </div>
          </div>
        </div>

        {/* Footer / Buttons */}
        <div className="flex justify-end gap-3 px-8 py-6 bg-slate-50/50 border-t border-gray-50">
          <button
            onClick={onClose}
            className="px-8 py-2 text-custom-blue  text-sm  border-2 border-custom-blue/20 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(isChecked)}
            className="px-10 py-2 bg-custom-blue text-sm text-white  rounded-lg hover:bg-[#083a6f] shadow-lg shadow-blue-900/20 transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceSettingsModal;