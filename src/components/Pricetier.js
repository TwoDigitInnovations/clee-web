import React, { useState } from "react";
import { X, Plus, Trash2, GripVertical, Users, Check } from "lucide-react";

const PriceTierModal = ({ isOpen, onClose, onSave, allStaff = [] }) => {
  // Price tiers list
  const [tiers, setTiers] = useState([
    { id: 1, name: "Senior Level", assignedStaffIds: [] }
  ]);
  
  // Staff selection view toggle
  const [showStaffListFor, setShowStaffListFor] = useState(null);

  if (!isOpen) return null;

  const addNewTier = () => {
    setTiers([...tiers, { id: Date.now(), name: "", assignedStaffIds: [] }]);
  };

  const removeTier = (id) => {
    setTiers(tiers.filter(t => t.id !== id));
  };

  const handleNameChange = (id, value) => {
    setTiers(tiers.map(t => t.id === id ? { ...t, name: value } : t));
  };

  const toggleStaffSelection = (tierId, staffId) => {
    setTiers(tiers.map(t => {
      if (t.id === tierId) {
        const isAlreadyAdded = t.assignedStaffIds.includes(staffId);
        return {
          ...t,
          assignedStaffIds: isAlreadyAdded 
            ? t.assignedStaffIds.filter(id => id !== staffId)
            : [...t.assignedStaffIds, staffId]
        };
      }
      return t;
    }));
  };

  // Get staff not assigned to OTHER tiers (to avoid duplicates)
  const getAvailableStaff = (currentTierId) => {
    const assignedInOtherTiers = tiers
      .filter(t => t.id !== currentTierId)
      .flatMap(t => t.assignedStaffIds);
    
    return allStaff.filter(s => !assignedInOtherTiers.includes(s.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <h2 className="text-[#0b4d92] text-xl font-bold">Price tiers</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-slate-600 text-sm mb-8 leading-relaxed">
            Create price tiers based on the skill level of your staff. You can then assign these tiers to your staff members in their profiles.
          </p>

          <div className="space-y-4">
            {tiers.map((tier) => (
              <div key={tier.id} className="relative">
                <div className="flex items-center gap-3">
                  {/* Drag Handle Icon */}
                  <GripVertical size={18} className="text-gray-300 cursor-grab" />
                  
                  {/* Input Field */}
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => handleNameChange(tier.id, e.target.value)}
                    placeholder="e.g. Senior Level"
                    className="flex-1 bg-[#e9ecef] border-none rounded-lg px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[#0b4d92]/20 outline-none"
                  />

                  {/* Staff Count / Selector Button */}
                  <button 
                    onClick={() => setShowStaffListFor(showStaffListFor === tier.id ? null : tier.id)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-lg border transition-colors ${
                      showStaffListFor === tier.id ? "bg-[#0b4d92] text-white border-[#0b4d92]" : "bg-gray-50 text-slate-600 border-gray-100"
                    }`}
                  >
                    <Users size={16} />
                    <span className="text-sm font-bold">{tier.assignedStaffIds.length}</span>
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={() => removeTier(tier.id)}
                    className="p-3 border border-red-50 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Inline Staff Selection List */}
                {showStaffListFor === tier.id && (
                  <div className="mt-2 ml-8 p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-inner animate-in fade-in slide-in-from-top-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 px-2">Assign Staff Members</p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {getAvailableStaff(tier.id).length > 0 ? (
                        getAvailableStaff(tier.id).map(staff => (
                          <div 
                            key={staff.id}
                            onClick={() => toggleStaffSelection(tier.id, staff.id)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-white cursor-pointer group"
                          >
                            <span className="text-xs font-medium text-slate-700">{staff.name}</span>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              tier.assignedStaffIds.includes(staff.id) ? "bg-[#0b4d92] border-[#0b4d92]" : "border-gray-300"
                            }`}>
                              {tier.assignedStaffIds.includes(staff.id) && <Check size={10} className="text-white" />}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 p-2 italic">No more staff available to assign</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add New Button */}
          <button
            onClick={addNewTier}
            className="mt-6 flex items-center gap-2 px-4 py-2 border border-[#0b4d92] text-[#0b4d92] rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors"
          >
            <Plus size={16} />
            Add new
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-6 bg-slate-50/50 border-t border-gray-50 mt-4">
          <button
            onClick={onClose}
            className="px-8 py-2.5 text-slate-600 font-bold border border-gray-300 rounded-lg hover:bg-white transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(tiers)}
            className="px-10 py-2.5 bg-[#0b4d92] text-white font-bold rounded-lg hover:bg-[#083a6f] shadow-lg shadow-blue-900/20 transition-all text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceTierModal;