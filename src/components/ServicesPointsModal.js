import React, { useState, useEffect, useMemo } from "react";
import { X, Search, CheckCircle2, Circle } from "lucide-react";

function ServicesPointsModal({
  items,
  setItems,
  open,
  data = [],
  onClose,
  onSave,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      const updated = data.map((item) => ({
        ...item,
        included: true, 
      }));

      setItems(updated);
      setSearchQuery("");
    }
  }, [open, data]);

  const stats = useMemo(() => {
    const included = items.filter((i) => i.included).length;
    return {
      total: items.length,
      included,
      excluded: items.length - included,
      allSelected: items.length > 0 && items.every((i) => i.included),
    };
  }, [items]);

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, included: !item.included } : item,
      ),
    );
  };

  const handleSelectAll = () => {
    const targetState = !stats.allSelected;
    setItems((prev) =>
      prev.map((item) => ({ ...item, included: targetState })),
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white sticky top-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Servicess Collecting Points
            </h2>
            <p className="text-sm text-slate-500">
              Manage which Servicess are eligible for reward points
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 pb-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-4">
              <div className="bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                <span className="text-xs text-custom-blue font-bold uppercase tracking-wider">
                  Included: {stats.included}
                </span>
              </div>
              <div className="bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
                <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                  Excluded: {stats.excluded}
                </span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search Servicess..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Bulk Action / Select All */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-slate-300 text-custom-blue focus:ring-blue-500 cursor-pointer"
                checked={stats.allSelected}
                onChange={handleSelectAll}
              />
              <span className="text-sm font-semibold text-slate-700 group-hover:text-custom-blue">
                Select All Servicess
              </span>
            </label>
            {!stats.allSelected && (
              <button
                onClick={() =>
                  setItems((prev) =>
                    prev.map((i) => ({ ...i, included: true })),
                  )
                }
                className="text-xs font-bold text-custom-blue hover:underline"
              >
                Include All Now
              </button>
            )}
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item._id}
                onClick={() => toggleItem(item._id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  item.included
                    ? "bg-blue-50/30 border-blue-100"
                    : "bg-white border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  {item.included ? (
                    <CheckCircle2 className="text-custom-blue" size={20} />
                  ) : (
                    <Circle className="text-slate-300" size={20} />
                  )}

                  <span
                    className={`text-sm font-medium ${item.included ? "text-blue-900" : "text-slate-700"}`}
                  >
                    {item.name}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter ${
                    item.included
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.included ? "Eligible" : "Excluded"}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-400 text-sm">
                No Servicess found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(items);
              onClose();
            }}
            className="px-8 py-2 text-sm font-bold text-white bg-custom-blue hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServicesPointsModal;
