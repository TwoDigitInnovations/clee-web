import DashboardHeader from "@/components/DashboardHeader";
import { ConfirmModal } from "@/components/deleteModel";
import { Api } from "@/services/service";
import React, { useState, useEffect } from "react";
import {
  MoreVertical,
  Calendar,
  Palette,
  Briefcase,
  Plus,
  FileText,
  Edit2,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

function AutomationRules(props) {
  const { loader, toaster } = props;
  const [open, setOpen] = useState(false);
  const [rules, setRules] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null); // Menu toggle ke liye
  const router = useRouter();
  // Exact dummy data from screenshot
  const dummyRules = [
    {
      _id: 1,
      title: "First Appointment",
      description:
        "Sent to new clients immediately after booking their first session.",
      status: "ACTIVE",
      sentCount: 128,
      icon: <Calendar size={20} className="text-blue-600" />,
    },
    {
      _id: 2,
      title: "Color Services",
      description:
        "Pre-service instruction sent for all Balayage and Highlights.",
      status: "ACTIVE",
      sentCount: 45,
      icon: <Palette size={20} className="text-blue-600" />,
    },
    {
      _id: 3,
      title: "Treatment Follow-up",
      description:
        "Post-care routine sent 24 hours after deep conditioning treatments.",
      status: "PAUSED",
      sentCount: 312,
      icon: <Briefcase size={20} className="text-blue-600" />,
    },
  ];

  const getAllAutomationRules = async () => {
    loader(true);
    Api("get", "automation/getAll", " ", router).then(
      (res) => {
        loader(false);
        if (res?.status) {
          setRules(res.data.data);
        } else {
          setRules(dummyRules); // Fallback to dummy
        }
      },
      (err) => {
        loader(false);
        setRules(dummyRules); // Fallback even on error for UI check
      },
    );
  };

  const handleDeleteConfirm = () => {
    try {
      loader(true);
      Api("delete", `automation/delete/${selectedId}`, "", router).then(
        (res) => {
          loader(false);
          if (res?.status === true) {
            toaster({ type: "success", message: "Rule deleted successfully" });
            getAllAutomationRules();
            setOpen(false);
          }
        },
      );
    } catch {
      loader(false);
      toaster("error", "Server error");
    }
  };

  useEffect(() => {
    getAllAutomationRules();
  }, []);

  return (
    <>
      <DashboardHeader title="Consult" />
      <div className="min-h-screen bg-custom-gray pb-20">
        <div className="max-w-7xl mx-auto md:px-6 px-4 py-8">
          <div className="bg-custom-blue rounded-2xl md:p-8 p-4 mb-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
            <div className="z-10 max-w-xl">
              <h1 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
                You can now send out Consult forms automatically!
              </h1>
              <p className="text-blue-100 mb-6 text-sm md:text-base">
                Streamline your client onboarding with automated consultations
                based on service selection.
              </p>
              <button
                className="bg-white text-custom-blue px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors"
                onClick={() => router.push("/consult/AddAutomationRules")}
              >
                Get started
              </button>
            </div>
            <div className="hidden md:block opacity-20 transform scale-150">
              <FileText size={120} className="text-white" />
            </div>
          </div>

          {/* Active Rules Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-[#1e3a8a]">Active Rules</h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Rule Cards */}
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {rule.icon || (
                        <FileText size={20} className="text-blue-600" />
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === rule._id ? null : rule._id,
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MoreVertical size={20} className="text-gray-400" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenu === rule._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1">
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            onClick={() => {
                              router.push(
                                `/consult/AddAutomationRules?id=${rule._id}`,
                              );
                              setActiveMenu(null);
                            }}
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            onClick={() => {
                              setSelectedId(rule._id);
                              setOpen(true);
                              setActiveMenu(null);
                            }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-[#1e3a8a] text-lg mb-2">
                    {rule.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {rule.description}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-auto">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${rule.status === "ACTIVE" ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">
                      {rule.status}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">
                    {rule.sentCount}{" "}
                    <span className="font-normal text-gray-400">sent</span>
                  </span>
                </div>
              </div>
            ))}

            {/* Create Custom Rule Card */}
            <div
              className="border-2 border-dashed border-blue-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-blue-50 transition-colors cursor-pointer min-h-[220px]"
              onClick={() => router.push("/consult/AddAutomationRules")}
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Plus size={24} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-[#1e3a8a] mb-2">
                Create Custom Rule
              </h3>
              <p className="text-xs text-gray-400 max-w-[150px]">
                Build your own automation logic from scratch
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={open}
        setIsOpen={setOpen}
        title="Delete Automation Rule"
        message="Are you sure you want to delete this rule? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />
    </>
  );
}

export default AutomationRules;
