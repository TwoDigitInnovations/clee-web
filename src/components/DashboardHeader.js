import { Bell, Phone, HelpCircle } from "lucide-react";

export default function DashboardHeader({ title, subtitle, showIcons = true }) {
  return (
    <div
      className="bg-white w-full flex md:items-center justify-between md:px-6 px-3 py-4 "
    >
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>

      {showIcons && (
        <div className="flex items-center gap-3 bg-white">
          <button className="p-2 bg-[#F1F5F9] rounded-lg shadow">
            <Bell size={22} color="#475569" />
          </button>

          <button className="p-2 bg-[#F1F5F9] rounded-lg shadow">
            <Phone size={22} color="#475569" />
          </button>

          <button className="p-2 bg-[#F1F5F9] rounded-lg shadow">
            <HelpCircle size={22} color="#475569" />
          </button>
        </div>
      )}
    </div>
  );
}
