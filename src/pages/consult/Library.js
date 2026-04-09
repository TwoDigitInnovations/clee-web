import React, { Activity, useEffect, useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  ActivityIcon,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { ConfirmModal } from "@/components/deleteModel";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTemplates,
  deleteTemplate,
} from "@/redux/actions/templateActions";

const TemplateManager = ({ loader, toaster }) => {
  const [currentTab, setCurrentTab] = useState("custom");
  const [searchVal, setSearchVal] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [open, setOpen] = useState(false);
  //   const [allTemplates, setAllTemplates] = useState(dummydata);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const { templates, loading } = useSelector((state) => state.template);

  useEffect(() => {
    dispatch(fetchTemplates(router));
  }, [currentTab]);

  const filteredData = templates
    ?.filter((t) => t.templateType === currentTab)
    ?.filter(
      (t) =>
        t.name?.toLowerCase().includes(searchVal.toLowerCase()) ||
        t.templateType?.toLowerCase().includes(searchVal.toLowerCase()),
    );

  const handleDeleteConfirm = async () => {
    try {
      loader(true);

      const res = await dispatch(deleteTemplate(selectedId, router));

      loader(false);

      if (res?.success) {
        toaster("success", "Template deleted successfully");
        setOpen(false);
      } else {
        toaster("error", res.message);
      }
    } catch {
      loader(false);
      toaster("error", "Server error");
    }
  };

  return (
    <>
      <DashboardHeader title="Consult" />
      <div className="min-h-screen bg-custom-gray pb-20">
        <div className="md:p-6 p-3 max-w-7xl mx-auto font-sans text-slate-900">
          {/* Header Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-custom-blue to-[#2152a3] rounded-2xl md:p-8 p-4 mb-8 flex justify-between items-center text-white">
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-2xl font-semibold mb-3">
                Protect your business, clients & staff with new and improved
                customisable forms
              </h1>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Access a range of customisable expert form templates, including
                a Covid health screener, or create your own from scratch. Send
                forms to your clients via SMS or email.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <button className="bg-white text-custom-blue px-5 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition"
                onClick={() => router.push("/consult/AddTemplate")}
                >
                  Give it a try
                </button>
                <button className="text-sm font-medium hover:underline decoration-white/50">
                  Send yourself a test consultation
                </button>
                <button className="text-white/60 text-sm hover:text-white">
                  Dismiss
                </button>
              </div>
            </div>
            <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none">
              <div className="w-64 h-64 border-[30px] border-white rounded-full"></div>
            </div>
          </div>

          {/* Controls Area */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {["custom", "Industry", "Expert"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentTab === tab
                      ? "bg-white text-custom-blue shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search the templates you're looking for"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </div>

            {/* New Template Button */}
            <button
              className="w-full md:w-auto bg-custom-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-custom-blue/90 transition-colors"
              onClick={() => router.push("/consult/AddTemplate")}
            >
              <Plus className="w-4 h-4" />
              New template
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredData.map((template, idx) => (
              <div
                key={idx}
                className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-400 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  {/* <template.icon size={20} strokeWidth={1.5} /> */}
                  <ActivityIcon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="text-[15px] font-semibold text-slate-800 mb-1 leading-snug">
                  {template.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Last Updated: {template.createdAt}
                </p>
                <span
                  className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest `}
                >
                  {/* {template.tag} */}
                </span>
                <button
                  onClick={() =>
                    setActiveMenu(
                      activeMenu === template._id ? null : template._id,
                    )
                  }
                  className="absolute bottom-5 right-4 text-slate-300 hover:text-slate-600"
                >
                  <MoreVertical size={18} />
                </button>

                {/* Dropdown Menu */}
                {activeMenu === template._id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        router.push(`/consult/AddTemplate?id=${template._id}`);
                        setActiveMenu(null);
                      }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      onClick={() => {
                        setSelectedId(template._id);
                        setOpen(true);
                        setActiveMenu(null);
                      }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div
              className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[160px] hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer group"
              onClick={() => router.push("/consult/AddTemplate")}
            >
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400 group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Create new from scratch
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Build your own custom template
              </p>
            </div>
          </div>

          <ConfirmModal
            isOpen={open}
            setIsOpen={setOpen}
            title="Delete template Library"
            message="Are you sure you want to delete this rule? This action cannot be undone."
            onConfirm={handleDeleteConfirm}
            yesText="Yes, Delete"
            noText="Cancel"
          />
        </div>
      </div>
    </>
  );
};

export default TemplateManager;
