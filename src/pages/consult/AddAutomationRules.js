import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  Scissors,
  Send,
  X,
  ChevronDown,
  CheckCircle2,
  Circle,
  Check,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { Api } from "@/services/service";
import Select from "react-select";

const AddAutomationRules = ({ loader, toaster }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [templates, setTemplates] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    templateId: "",
    selectedServices: [],
    addAllServices: false,
    whenToSend: "reminder",
    viaEmail: true,
    viaSMS: true,
    newClientsOnly: false,
  });

  const fetchTemplates = async () => {
    try {
      const res = await Api("get", "templates/getAll", "", router);
      setTemplates(res?.data.data || []);
    } catch (err) {
      console.error("Template Error", err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await Api("get", "services/getAll", "", router);
      setServices(res?.data?.data || []);
    } catch (err) {
      console.error("Services Error", err);
    }
  };

  const fetchAutomationById = async () => {
    if (!id) return;
    try {
      const res = await Api("get", `automation/${id}`, "", router);
      if (res?.status) {
        const data = res.data.data;
        setFormData(data);
      }
    } catch (err) {
      console.error("Edit Error", err);
    }
  };
  const fetchData = async () => {
    loader(true);
    try {
      fetchTemplates(); // parallel
      fetchServices(); // parallel
      fetchAutomationById(); // parallel
    } finally {
      loader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const serviceOptions = services?.map((s) => ({
    value: s._id,
    label: s.name,
  }));

  console.log(serviceOptions);
  console.log(services);

  const selectedOptions = formData?.selectedServices?.map((s) => ({
    value: s._id,
    label: s.name,
  }));

  const toggleService = (service) => {
    setFormData((prev) => {
      const isSelected = prev.selectedServices.some(
        (s) => s._id === service._id,
      );
      return {
        ...prev,
        selectedServices: isSelected
          ? prev.selectedServices.filter((s) => s._id !== service._id)
          : [...prev.selectedServices, service],
      };
    });
  };

  const handleSubmit = async () => {
    loader(true);
    const config = id
      ? { method: "put", url: `automation/update/${id}`, msg: "Rule updated" }
      : { method: "post", url: "automation/create", msg: "Rule created" };

    try {
      const res = await Api(config.method, config.url, formData, router);
      if (res?.status) {
        toaster("success", config.msg);
        router.push("/consult/AutomationRules");
        setFormData({});
      }
    } catch {
      toaster("error", "Server error");
    } finally {
      loader(false);
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#f3f4f6",
      borderRadius: "0.75rem",
      border: "none",
      padding: "2px",
      boxShadow: "none",
    }),

    input: (base) => ({
      ...base,
      color: "#000", // typing text
    }),

    singleValue: (base) => ({
      ...base,
      color: "#000", // selected single value
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: "#000", // selected chips text
    }),

    placeholder: (base) => ({
      ...base,
      color: "#6b7280", // gray placeholder
    }),

    menu: (base) => ({
      ...base,
      zIndex: 9999, // dropdown upar aaye
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#e5e7eb" : "#fff",
      color: "#000",
      cursor: "pointer",
    }),
  };

  // Reusable Section Header Component to keep code short
  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-blue-50 rounded-lg text-custom-blue">
        <Icon size={20} />
      </div>
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    </div>
  );

  return (
    <>
      <DashboardHeader title="Consult" />
      <div className="min-h-screen bg-custom-gray pb-20">
        {/* Header Section */}
        <div className="p-3 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[11px] md:text-[13px] text-gray-400 font-medium">
              Automation rules • {id ? "Edit rule" : "Create new rule"}
            </span>
            <h1 className="text-lg md:text-xl font-bold text-[#1e3a8a]">
              {id ? "Update Rule" : "Create New Rule"}
            </h1>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => router.back()}
              className="flex-1 md:flex-none px-6 py-2 border rounded-lg text-sm font-medium bg-white text-black"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 md:flex-none px-8 py-2 bg-custom-blue text-white rounded-lg text-sm font-bold"
            >
              Save
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 md:px-4 mt-6 space-y-4">
          {/* Template Selection */}
          <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
            <SectionHeader icon={FileText} title="Select a template" />
            <label className="text-sm font-semibold text-gray-400 block mb-2">
              Consultation Form Template
            </label>
            <div className="relative">
              <select
                className="w-full bg-gray-100 rounded-xl text-black p-2.5 text-sm appearance-none outline-none"
                value={formData.templateId}
                onChange={(e) =>
                  setFormData({ ...formData, templateId: e.target.value })
                }
              >
                <option value="">Select Template</option>
                {templates.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>

          {/* Services Selection */}
          <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <SectionHeader icon={Scissors} title="Select services" />
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500">
                  Add all services
                </span>
                <div
                  onClick={() =>
                    setFormData((p) => {
                      const newValue = !p.addAllServices;

                      return {
                        ...p,
                        addAllServices: newValue,
                        selectedServices: newValue ? services : [], // 🔥 yahi fix hai
                      };
                    })
                  }
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.addAllServices ? "bg-custom-blue" : "bg-gray-200"}`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.addAllServices ? "right-1" : "left-1"}`}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Select
                options={serviceOptions}
                isMulti
                styles={customStyles}
                value={selectedOptions}
                onChange={(selected) => {
                  const selectedData = selected.map((item) => ({
                    _id: item.value,
                    name: item.label,
                  }));

                  setFormData({
                    ...formData,
                    selectedServices: selectedData,
                  });
                }}
                placeholder="Search and select services..."
                className="text-sm"
                classNamePrefix="react-select"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {formData?.selectedServices?.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center gap-2 bg-[#eef2ff] text-[#4f46e5] px-3 py-1.5 rounded-md text-xs font-medium border border-blue-100"
                >
                  {s.name}{" "}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => toggleService(s)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Settings */}
          <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
            <SectionHeader icon={Send} title="Select delivery settings" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-4">
                  When to send
                </label>
                <div className="space-y-4">
                  {[
                    {
                      id: "after",
                      label: "Send right after booking",
                      desc: "Automation triggers immediately after confirmation.",
                    },
                    {
                      id: "reminder",
                      label: "Send with reminder message",
                      desc: "",
                    },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() =>
                        setFormData({ ...formData, whenToSend: opt.id })
                      }
                      className={`p-4 rounded-xl border-2 cursor-pointer ${formData.whenToSend === opt.id ? "border-custom-blue bg-blue-50/30" : "border-gray-100 bg-gray-50"}`}
                    >
                      <div className="flex gap-3">
                        {formData.whenToSend === opt.id ? (
                          <CheckCircle2
                            className="text-custom-blue"
                            size={20}
                          />
                        ) : (
                          <Circle className="text-gray-300" size={20} />
                        )}
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {opt.label}
                          </p>
                          {opt.desc && (
                            <p className="text-[10px] text-gray-500 mt-1">
                              {opt.desc}
                            </p>
                          )}
                          {opt.id === "reminder" &&
                            formData.whenToSend === "reminder" && (
                              <div className="mt-4 space-y-3">
                                {["Email", "SMS"].map((type) => {
                                  const key = `via${type}`;
                                  return (
                                    <label
                                      key={type}
                                      className="flex items-center gap-3 cursor-pointer"
                                    >
                                      <div
                                        className={`w-5 h-5 rounded flex items-center justify-center border ${formData[key] ? "bg-custom-blue border-custom-blue" : "bg-white"}`}
                                      >
                                        {formData[key] && (
                                          <Check
                                            size={14}
                                            className="text-white"
                                          />
                                        )}
                                      </div>
                                      <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={formData[key]}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            [key]: e.target.checked,
                                          })
                                        }
                                      />
                                      <span className="text-xs font-medium text-gray-700">
                                        Via {type}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-4">
                  Target Recipients
                </label>
                <div
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      newClientsOnly: !p.newClientsOnly,
                    }))
                  }
                  className={`p-4 rounded-xl border-2 cursor-pointer ${formData.newClientsOnly ? "border-custom-blue bg-blue-50/30" : "border-gray-100 bg-gray-50"}`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center ${formData.newClientsOnly ? "bg-custom-blue border-custom-blue" : "bg-white"}`}
                    >
                      {formData.newClientsOnly && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        New clients only
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Only send to clients who are new to your business.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAutomationRules;
