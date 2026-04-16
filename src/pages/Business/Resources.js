import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/router";
import { Trash2, Info } from "lucide-react";
import { ConfirmModal } from "@/components/deleteModel";
import { Api } from "@/services/service";
import ResourceSettingsModal from "@/components/ResourceSettingsModal";

function Resources(props) {
  const [resources, setResources] = useState([]);
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePopover, setActivePopover] = useState(null); 
  const router = useRouter();

  const handleSave = (data) => {
    setIsModalOpen(false);
  };

  const fetchResources = async () => {
    try {
      props.loader(true);
      const res = await Api("get", `resource/getAll`, "", router);
      props.loader(false);
      if (res?.status === true && res.data.data.length > 0) {
        setResources(res.data.data);
      }
    } catch (err) {
      props.loader(false);

      props.toaster({ type: "error", message: "Failed to fetch Resources" });
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDeleteClick = (id) => {
    setId(id);
    setOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!id) return;
    props.loader(true);
    Api("delete", `resource/delete/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          props.toaster({ type: "success", message: "Deleted successfully" });
          fetchResources();
          setOpen(false);
        }
      })
      .catch(() => props.loader(false));
  };

  return (
    <>
      <DashboardHeader title="Your Business" />

      <div className="min-h-screen bg-custom-gray md:px-6 px-3 py-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-6">
          <h2 className="text-xl font-bold text-slate-700">Resources</h2>

          <div className="flex items-center justify-start gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0A4D911A] text-custom-blue px-5 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Resource Settings
            </button>
            <button
              onClick={() => router.push("/Business/AddResources")}
              className="bg-custom-blue text-white px-5 py-2 rounded text-sm font-medium hover:bg-[#083a6f] transition-colors"
            >
              Add Resources
            </button>
          </div>
        </div>

        {resources.length !== 0 && (
          <div className="grid grid-cols-12 border-b border-gray-200 pb-3 mb-2 px-2">
            <div className="col-span-4 text-sm font-bold text-slate-600 flex items-center gap-1">
              Resource name
            </div>
            <div className="col-span-4 text-sm font-bold text-slate-600 flex items-center gap-1">
              Resource items
            </div>
          </div>
        )}

        <div className="space-y-1">
          {resources.length === 0 ? (
            <div className="mt-8 p-4 bg-[#f0f4f8] border border-[#d1dbe5] rounded flex items-start gap-3">
              <div className="bg-custom-blue rounded-full p-1 mt-0.5">
                <Info size={14} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1e293b]">
                  No resources have been set up yet
                </h3>
                <p className="text-sm text-slate-600">
                  You can add resources here and then assign a resource to a
                  service to keep track of what resources are available when
                  booking.
                </p>
              </div>
            </div>
          ) : (
            resources.map((item, index) => (
              <div
                key={item._id || index}
                className="grid grid-cols-12 items-center py-4 px-2 hover:bg-gray-50 border-b border-gray-50 relative"
              >
                <div className="col-span-4 text-sm font-medium text-slate-600">
                  {item.resource_name}
                </div>

                <div className="col-span-4 relative">
                  <button
                    onClick={() =>
                      setActivePopover(activePopover === index ? null : index)
                    }
                    className="text-blue-600 text-sm hover:underline"
                  >
                    {item.items?.length || 0} items
                  </button>

                  {activePopover === index && (
                    <div className="absolute z-50 left-0 top-8 w-64 bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-[#f8f9fb] p-2 border-b border-gray-100">
                        <span className="text-xs font-bold text-slate-700">
                          Resource items
                        </span>
                      </div>
                      <div className="p-0">
                        <table className="w-full text-left text-[11px]">
                          <thead className="text-slate-500 bg-white">
                            <tr>
                              <th className="px-3 py-2 font-semibold">
                                Item name
                              </th>
                              <th className="px-3 py-2 font-semibold">
                                Location
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-600">
                            {item.items.map((sub, i) => (
                              <tr key={i} className="border-t border-gray-50">
                                <td className="px-3 py-2">{sub}</td>
                                <td className="px-3 py-2">
                                  {sub.location || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-span-4 flex justify-end gap-2">
                  <button
                    onClick={() =>
                      router.push(`/Business/AddResources?id=${item._id}`)
                    }
                    className="bg-custom-blue hover:bg-custom-blue/90 text-white px-4 py-1.5 rounded text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item._id)}
                    className="p-1.5 border border-gray-300 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2
                      size={16}
                      className="text-slate-400 hover:text-red-500"
                    />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={open}
        setIsOpen={setOpen}
        title="Delete Resources"
        message={`Are you sure you want to delete this resource?`}
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />
      <ResourceSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}

export default Resources;
