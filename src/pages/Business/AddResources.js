import React, { useEffect, useState } from "react";
import { Plus, Info } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Api } from "@/services/service";

function getInitialState() {
  return {
    resource_name: "",
    items: [""], 
  };
}

function validate(formData) {
  const errors = {};
  if (!formData.resource_name.trim())
    errors.resource_name = "Resource name is required.";
  return { isValid: Object.keys(errors).length === 0, errors };
}

function getItemName(resourceName, index, items) {
  const base = resourceName.trim();
  if (!base) return "";
 
  if (items.length === 1) {
    return base;
  }
  return `${base} ${index + 1}`;
}

export default function AddResource(props) {
  const [formData, setFormData] = useState(getInitialState());
  const [errors, setErrors] = useState({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    const fetchResource = async () => {
      try {
        props.loader(true);
        const res = await Api("get", `resource/${id}`, "", router);
        props.loader(false);

        if (res?.status === true) {
          const data = res.data.data;
          setFormData({
            resource_name: data.resource_name || "",
            items: data.items?.length ? data.items : [""],
          });
        } else {
          props.toaster("error", res?.message || "Failed to fetch resource");
        }
      } catch (err) {
        props.loader(false);
        props.toaster("error", "Server error");
      }
    };

    fetchResource();
  }, [id]);

  const setResourceName = (value) => {
    setFormData((prev) => ({ ...prev, resource_name: value }));
  };

 
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, ""],
    }));
  };

  
  const removeItem = (index) => {
    setFormData((prev) => {
      const updated = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: updated.length ? updated : [""] };
    });
  };

  const handleSubmit = async () => {
    const { isValid, errors: errs } = validate(formData);

    if (!isValid) {
      setErrors(errs);
      props.toaster("error", Object.values(errs)[0]);
      return;
    }

    setErrors({});

    const namedItems = formData.items.map((_, index) =>
      getItemName(formData.resource_name, index, formData.items)
    );

    const payload = {
      resource_name: formData.resource_name,
      items: namedItems,
    };

    try {
      props.loader(true);

      let res;
      if (id) {
        res = await Api("put", `resource/update/${id}`, payload, router);
      } else {
        res = await Api("post", `resource/create`, payload, router);
      }

      props.loader(false);

      if (res?.status === true) {
        props.toaster(
          "success",
          id ? "Resource updated successfully" : "Resource created successfully"
        );
        if (!id) setFormData(getInitialState());
        router.push("/Business/Resources");
      } else {
        props.toaster("error", res?.message || "Something went wrong");
      }
    } catch (err) {
      props.loader(false);
      props.toaster("error", "Server error");
    }
  };

  const resourceName = formData.resource_name.trim();

  return (
    <>
      <DashboardHeader title="Resources" />
      <div className="min-h-screen bg-custom-gray ">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-1">
            <span
              className="hover:underline cursor-pointer text-custom-blue"
              onClick={() => router.push("/Business/Resources")}
            >
              Resource
            </span>
            <span className="mx-1">›</span>
            <span className="text-gray-700">
              {id ? "Edit Resource" : "Add Resource"}
            </span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? "Edit Resource" : "Resources"}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/Business/Resources")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition"
              >
                Save
              </button>
            </div>
          </div>

          {/* Resource Name Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 shadow-sm">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Resource Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Treatment Room 1"
              value={formData.resource_name}
              onChange={(e) => setResourceName(e.target.value)}
              className={`w-full border ${
                errors.resource_name ? "border-red-400" : "border-gray-300"
              } rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50`}
            />
            {errors.resource_name && (
              <p className="text-xs text-red-500 mt-1">{errors.resource_name}</p>
            )}
          </div>

       
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="text-base font-semibold text-gray-900">
                Resource Items
              </h2>
              <button
                type="button"
                // onClick={() => router.push("/Business/InventoryControl")}
                className="text-xs font-semibold text-custom-blue border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md tracking-wide uppercase transition"
              >
                Inventory Control
              </button>
            </div>

            <div className="mx-5 mb-4 border-l-4 border-blue-600 pl-4">
            
              <div className="space-y-3">
                {formData.items.map((_, index) => {
                  const displayName = resourceName
                    ? getItemName(resourceName, index, formData.items)
                    : "";

                  return (
                    <div key={index}>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Item {index + 1}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700 min-h-[38px] flex items-center">
                          {displayName || (
                            <span className="text-gray-400">
                              {resourceName
                                ? displayName
                                : "Enter resource name above"}
                            </span>
                          )}
                        </div>
                    
                        {index === formData.items.length - 1 ? (
                          <button
                            type="button"
                            onClick={addItem}
                            className="w-9 h-9 flex items-center justify-center bg-custom-blue text-white rounded-lg hover:bg-custom-blue/90 transition flex-shrink-0"
                          >
                            <Plus size={16} strokeWidth={2.5} />
                          </button>
                        ) : (
                       
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition flex-shrink-0 text-lg font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

          
              <div className="flex items-start gap-2 mt-4 text-[13px] text-gray-500 md:w-[70%]">
                <Info size={14} className="text-custom-blue flex-shrink-0 mt-0.5" />
                <p>
                  If you have more than one of this resource, add more items to
                  this section. For example: a resource called{" "}
                  <span className="font-medium">
                    '{resourceName || "Waxing room"}'
                  </span>{" "}
                  and items called{" "}
                  <span className="font-medium">
                    '{resourceName ? `${resourceName} 1` : "Waxing room 1"}'
                  </span>{" "}
                  and{" "}
                  <span className="font-medium">
                    '{resourceName ? `${resourceName} 2` : "Waxing room 2"}'
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

       
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => router.push("/Business/Resources")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-custom-blue rounded-lg hover:bg-custom-blue/90 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}