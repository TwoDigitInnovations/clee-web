import React, { useState, useEffect } from "react";
import { ChevronDown, Info, ChevronRight } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { Api } from "@/services/service";

const AddServicesGroup = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    allowOnlineBooking: true,
    selectedService: "",
    paymentPolicy: "default", // 'default' or 'different'
    differentPolicyType: "Do not accept online payments",
  });
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [category, setCategory] = useState([]);
  const router = useRouter();
  const [addedServices, setAddedServices] = useState([]);
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      props.loader(true);
      const res = await Api("get", "services/getAll", "", null);
      props.loader(false);
      if (res?.status === true && res.data?.data?.length > 0) {
        setServices(res.data.data);
      }
    } catch {
      props.loader(false);
      props.toaster("error", "Failed to fetch services");
    }
  };
  useEffect(() => {
    fetchCategory();
    fetchServices();
  }, []);

  const fetchCategory = async () => {
    try {
      props.loader(true);
      const res = await Api("get", "Category/getAll", "", router);
      props.loader(false);
      if (res?.status === true && res.data?.data?.length > 0) {
        setCategory(res.data.data.map((c) => ({ id: c._id, label: c.name })));
      }
    } catch {
      props.loader(false);
      props.toaster("error", "Failed to fetch categories");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      services: addedServices,
    };

    try {
      props.loader(true);
      console.log(payload);
      let res;
      if (id) {
        res = await Api("put", `service-groups/update/${id}`, payload, router);
      } else {
        res = await Api("post", `service-groups/create`, payload, router);
      }
      console.log(res);

      props.loader(false);

      if (res?.status === true) {
        props.toaster(
          "success",
          id
            ? "Service group updated successfully"
            : "Service group created successfully",
        );
        if (!id)
          setFormData({
            name: "",
            category: "",
            description: "",
            allowOnlineBooking: true,
            selectedService: "",
            paymentPolicy: "default", // 'default' or 'different'
            differentPolicyType: "Do not accept online payments",
          });
        setAddedServices([]);
        router.push("/Business/Services");
      } else {
        props.toaster("error", res?.message || "Something went wrong");
      }
    } catch (err) {
      props.loader(false);
      console.log("FINAL ERROR 👉", err);
      props.toaster("error", err?.message || "Server error");
    }
  };

  const handleAddService = () => {
    const selected = services.find((s) => s._id === formData.selectedService);

    if (!selected) return;
    console.log(selected);

    const newService = {
      service: selected._id,
      name: selected.name,
      duration: selected.duration || "00:30",
      paddingBefore: selected.paddingBefore || "00:00",
      paddingAfter: selected.paddingAfter || "00:00",
      cost: selected.price || 0,
      overridePrice: false,
    };

    setAddedServices((prev) => [...prev, newService]);
  };

  return (
    <>
      <DashboardHeader title="Your Business" />
      <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 font-sans text-[#2D3748]">
        <div className="flex md:flex-row flex-col gap-2 justify-between md:items-center mb-6 border-b border-gray-200 pb-4">
          <div>
            <nav className="text-sm text-gray-500 flex items-center gap-1 mb-1">
              <span className="hover:underline cursor-pointer">Services</span>
              <ChevronRight size={12} />
              <span className="font-medium text-gray-700">
                Add Services Group
              </span>
            </nav>
            <h1 className="text-xl md:text-2xl font-bold text-custom-blue">
              Services
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              className="px-6 py-2 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50 transition-colors"
              onClick={() => router.push("/Business/Services")}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-2 bg-custom-blue text-white rounded text-sm font-medium hover:bg-blue-900 transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Section 1: Service Group Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Service group details
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Choose the name and general details of this service group.
              </p>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Service group name *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter service group name..."
                    className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Service group category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full text-sm p-2 border border-gray-300 rounded appearance-none outline-none pr-8 bg-white"
                    >
                      <option value="">No category</option>
                      {category.map((cat, idx) => (
                        <option key={idx} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-2 top-3 text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter service group description..."
                  className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
                <p className="text-[12px] text-gray-400 mt-1">
                  Characters left: {1000 - formData.description.length}
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="allowOnlineBooking"
                  checked={formData.allowOnlineBooking}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Clients can book this service group online, or add themselves
                  to your waitlist
                </span>
              </label>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Service group items
              </h3>
            </div>
            <div className="md:col-span-2 space-y-4">
              {addedServices.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-7 gap-4 bg-gray-50 p-3 text-sm font-semibold text-gray-600">
                    <div>Name</div>
                    <div>Duration</div>
                    <div>Padding before</div>
                    <div>Padding after</div>
                    <div>Cost</div>
                    <div> Over ride Price </div>
                    <div></div>
                  </div>

                  {addedServices.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-7 gap-4 items-center p-3 border-t"
                    >
                      <div className="text-sm text-gray-700">{item.name}</div>

                      <input
                        type="time"
                        value={item.duration}
                        onChange={(e) => {
                          const updated = [...addedServices];
                          updated[idx].duration = e.target.value;
                          setAddedServices(updated);
                        }}
                        className="border rounded px-2 py-1"
                      />

                      <input
                        type="time"
                        value={item.paddingBefore}
                        onChange={(e) => {
                          const updated = [...addedServices];
                          updated[idx].paddingBefore = e.target.value;
                          setAddedServices(updated);
                        }}
                        className="border rounded px-2 py-1"
                      />

                      <input
                        type="time"
                        value={item.paddingAfter}
                        onChange={(e) => {
                          const updated = [...addedServices];
                          updated[idx].paddingAfter = e.target.value;
                          setAddedServices(updated);
                        }}
                        className="border rounded px-2 py-1"
                      />

                      <input
                        type="number"
                        placeholder="$0"
                        value={item.cost}
                        onChange={(e) => {
                          const updated = [...addedServices];
                          updated[idx].cost = e.target.value;
                          setAddedServices(updated);
                        }}
                        className="border rounded px-2 py-1"
                      />

                      <input
                        type="checkbox"
                        value={item.overridePrice}
                        className="border rounded px-2 py-1"
                      />

                      <button
                        onClick={() => {
                          setAddedServices((prev) =>
                            prev.filter((_, i) => i !== idx),
                          );
                        }}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#EBF5FF] border border-[#D1E9FF] p-4 rounded-lg flex gap-3 items-center">
                  <div className="bg-custom-blue rounded-full p-1 text-white">
                    <Info size={16} />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-custom-blue">
                      No services added to this service group
                    </p>
                    <p className="text-custom-blue/80">
                      Add services in the order that you want them to appear in
                      your service group.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    name="selectedService"
                    value={formData.selectedService}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded appearance-none outline-none pr-8 bg-white"
                  >
                    <option value="">Select service</option>
                    {services.map((service, idx) => (
                      <option key={idx} value={service._id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-2 top-3 text-gray-400"
                  />
                </div>
                <button
                  className="px-6 py-2 bg-custom-blue text-white rounded text-sm font-medium"
                  onClick={handleAddService}
                >
                  Include service
                </button>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Section 3: Online Payments */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
            <div>
              <h3 className="text-lg font-semibold mb-1">Online payments</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Choose how customers can pay for online bookings.
              </p>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentPolicy"
                    value="default"
                    checked={formData.paymentPolicy === "default"}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Use default payment policy (require payment of $99.00
                    deposit -{" "}
                    <span className="text-blue-600 hover:underline">edit</span>)
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentPolicy"
                    value="different"
                    checked={formData.paymentPolicy === "different"}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-gray-700 block mb-3">
                      Use a different payment policy for this service group:
                    </span>
                    <div className="relative max-w-md">
                      <select
                        disabled={formData.paymentPolicy !== "different"}
                        className="w-full p-2 border border-gray-300 rounded appearance-none outline-none pr-8 bg-white disabled:bg-gray-50"
                      >
                        <option>Do not accept online payments</option>
                        <option>Full payment upfront</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-2 top-3 text-gray-400"
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sticky Footer Buttons (Optional match) */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-3 px-10">
            <button
              className="px-6 py-2 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50"
              onClick={() => router.push("/Business/Services")}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-2 bg-custom-blue text-white rounded text-sm font-medium hover:bg-blue-900"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddServicesGroup;
