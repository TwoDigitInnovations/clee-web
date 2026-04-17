import React, { useState } from "react";
import { Shield, Info, UserPlus, Users, X } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";

function Administrators() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-custom-gray pb-20">
      <DashboardHeader title="Administration" />

      <div className="max-w-7xl mx-auto md:p-6 p-4">
        <h1 className="md:flex hidden text-xl md:text-2xl font-semibold text-custom-blue mb-6">
          Administrators
        </h1>

        <div className="bg-white border-l-4 border-custom-blue rounded-xl shadow-sm p-3 md:p-5 mb-8 flex gap-4">
          <div className="mt-1">
            <div className="bg-blue-50 p-2 rounded-full">
              <Info size={20} className="text-custom-blue" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">
              Add back office or support team members
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed max-w-2xl">
              Set up administrative accounts for team members who need access to
              the dashboard but do not provide services. You can control exactly
              which parts of the system they can view or modify.
            </p>
          </div>
        </div>

        {/* Empty State Card */}
        <div className="bg-white border border-blue-100 rounded-[2rem] md:p-12 p-6 flex flex-col items-center justify-center text-center shadow-sm min-h-[450px]">
          {/* Shield Icon Container */}
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8">
            <div className="text-custom-blue">
              <Shield size={48} strokeWidth={1.5} />
            </div>
          </div>

      
          <h2 className="md:text-2xl text-xl font-bold text-slate-800 mb-3">
            No administrators yet
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-10 leading-relaxed">
            Get started by adding your first administrator to help manage your
            salon operations and staff schedules.
          </p>

        
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => router.push("/administration/addAdministrators")}
              className="bg-custom-blue hover:bg-[#0a3d75] text-white px-8 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all"
            >
              <UserPlus size={18} /> Add administrator
            </button>

            <button className="bg-white border border-blue-100 text-custom-blue hover:bg-blue-50 px-8 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all">
              <Users size={18} /> Manage staff access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Administrators;
