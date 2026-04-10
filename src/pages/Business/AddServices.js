import React, { useState, useEffect } from "react";
import { ChevronDown, Info, Plus, Clock, DollarSign, X } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { Api } from "@/services/service";
import { useRouter, useSearchParams } from "next/navigation";
import PriceTierModal from "@/components/Pricetier";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff } from "@/redux/actions/staffActions";

const SERVICE_COLORS = [
  "#e53e3e",
  "#dd6b20",
  "#d69e2e",
  "#38a169",
  "#319795",
  "#3182ce",
  "#805ad5",
  "#d53f8c",
  "#1a202c",
  "#718096",
];

const COLOR_WHEEL_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Colour_wheel_bright.svg/240px-Colour_wheel_bright.svg.png";

function SectionRow({ left, right }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:px-6 px-4 py-5 border-b border-gray-200 last:border-0">
      <div className="col-span-1">
        <p className="text-md font-semibold text-slate-700">{left.title}</p>
        {left.description && (
          <p className="text-[13px] text-slate-400 mt-1 leading-relaxed">
            {left.description}
          </p>
        )}
      </div>
      <div className="col-span-2">{right}</div>
    </div>
  );
}

function Label({ children, required }) {
  return (
    <label className="block text-[13px] font-medium text-slate-600 mb-1">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full border border-gray-200 rounded-md px-3 py-1.5 text-[13px] text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${className}`}
      {...props}
    />
  );
}

function Select({ options, className = "", ...props }) {
  return (
    <div className="relative">
      <select
        className={`w-full appearance-none border border-gray-200 rounded-md px-3 py-1.5 pr-8 text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}

function Checkbox({ checked, onChange, label, className = "" }) {
  return (
    <label
      className={`flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 rounded accent-[#1e4e8c]"
      />
      {label}
    </label>
  );
}

function LinkBtn({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[12px] text-[#1e4e8c] font-medium hover:underline mt-1"
    >
      {children}
    </button>
  );
}

export default function AddServices({ loader, toaster }) {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [tiers, setTiers] = useState([]);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    description: "",
    priceType: "Fixed price",
    price: "00.00",
    prices: {},
    durationH: "0",
    durationM: "00:30",
    isPaddingAndProcessing: false,
    paddingBeforeTime: "00:00",
    paddingAfterTime: "00:00",
    tax: "",
    priceIncludesTax: true,
    serviceColor: "#319795",
    selectedStaff: { all: true },
    onlineBookings: true,
    vipOnly: false,
    isVideoCall: false,
    bookingQuestion: "",
    paymentPolicy: "default",
    onlinePayment: "default",
  });

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const set = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const setCheck = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.checked }));

  const { staff, loading } = useSelector((state) => state.staff);

  useEffect(() => {
    dispatch(fetchStaff());
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        loader(true);

        const res = await Api("get", `services/${id}`, "", router);

        loader(false);

        if (res?.status === true) {
          const data = res.data.data;

          const hours = Math.floor((data.duration || 0) / 60);
          const minutes = (data.duration || 0) % 60;

          setForm({
            serviceName: data.name || "",
            category: data.category?._id || "",
            description: data.description || "",

            priceType: data.priceType || "Fixed price",
            price: data.price?.toString() || "00.00",
            prices: {},

            // ✅ duration mapping
            durationH: hours.toString(),
            durationM: `00:${minutes.toString().padStart(2, "0")}`,

            // ❗ padding logic (agar backend me hai toh map karo)
            isPaddingAndProcessing: false,
            paddingBeforeTime: data.paddingBeforeTime || "00:00",
            paddingAfterTime: data.paddingAfterTime || "00:00",

            tax: data.tax || "",
            priceIncludesTax: data.priceIncludesTax ?? true,

            serviceColor: data.color || "#319795",

            selectedStaff:
              data.staff?.length > 0
                ? data.staff.reduce(
                    (acc, id) => ({ ...acc, [id]: true, all: false }),
                    {},
                  )
                : { all: true },

            onlineBookings: data.onlineBookings ?? true,
            vipOnly: data.vipOnly ?? false,
            isVideoCall: data.isVideoCall ?? false,

            bookingQuestion: data.bookingQuestion || "",
            paymentPolicy: data.paymentPolicy || "default",
            onlinePayment: data.onlinePayment || "default",
          });
        } else {
          toaster({
            type: "error",
            message: res?.message || "Failed to fetch service",
          });
        }
      } catch (err) {
        loader(false);
        toaster({ type: "error", message: "Server error" });
      }
    };

    fetchService();
  }, [id]);

  const fetchPriceTiers = async () => {
    try {
      loader(true);
      const res = await Api("get", `price-tiers/getAll`, "", router);
      loader(false);
      if (res?.status === true && res.data.data.length > 0) {
        const data = res.data.data;
        setTiers(data);
      }
    } catch (err) {
      loader(false);
      toaster({ type: "error", message: "Failed to fetch Price Tiers" });
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await Api("get", "Category/getAll", "", router);
        if (res?.status === true && res.data?.data?.length > 0) {
          setCategories(
            res.data.data.map((c) => ({ id: c._id, label: c.name })),
          );
        }
      } catch {}
    };
    fetch();
    fetchPriceTiers();
  }, []);

  const handleStaffToggle = (id) => {
    setForm((prev) => {
      const updated = { ...prev.selectedStaff, [id]: !prev.selectedStaff[id] };
      if (id === "all") {
        const val = !prev.selectedStaff["all"];
        staff.forEach((s) => (updated[s.id] = val));
      } else {
        const allChecked = staff
          .filter((s) => s.id !== "all")
          .every((s) => updated[s.id]);
        updated["all"] = allChecked;
      }
      return { ...prev, selectedStaff: updated };
    });
  };

  const handlePriceTierSave = async (data) => {
    try {
      //   loader(true);
      console.log(data);

      const res = await Api("post", `price-tiers/save`, data, router);
      loader(false);
      if (res?.status === true) {
        toaster({ type: "success", message: "Price tier saved!" });
        setIsModalOpen(false);
        setTiers([]);
        fetchPriceTiers();
      }
    } catch (err) {
      loader(false);
      toaster({ type: "error", message: "Failed to save price tier" });
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!form.serviceName.trim()) {
      toaster({ type: "error", message: "Service name is required" });
      return;
    }

    loader(true);

    try {
      let res;

      if (id) {
        res = await Api("put", `services/update/${id}`, form, router);
      } else {
        res = await Api("post", "services/create", form, router);
      }

      loader(false);

      if (res?.status === true) {
        toaster({
          type: "success",
          message: id
            ? "Service updated successfully!"
            : "Service created successfully!",
        });

        router.push("/Business/Services");
      }
    } catch (error) {
      loader(false);
      toaster({
        type: "error",
        message: id ? "Failed to update service" : "Failed to create service",
      });
    }
  };

  const descLen = form.description.length;

  const handleTogglePadding = () => {
    setForm((prev) => ({
      ...prev,
      isPaddingAndProcessing: true,
    }));
  };

  const handleRemovePadding = () => {
    setForm((prev) => ({
      ...prev,
      isPaddingAndProcessing: false,
      paddingBeforeTime: "00:00",
      paddingAfterTime: "00:00",
    }));
  };

  const handleTaxChange = (value) => {
    setForm((prev) => ({
      ...prev,
      tax: value,
      priceIncludesTax:
        value === "Not Applicable" ? false : form.priceIncludesTax,
    }));
  };

  return (
    <>
      <DashboardHeader title="Your Business" />
      <div className="min-h-screen bg-[#f4f7fb]">
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[14px] text-gray-400 mb-0.5">
              <span
                className="hover:text-custom-blue cursor-pointer"
                onClick={() => router.push("/Business/Services")}
              >
                Services
              </span>
              <span>›</span>
              <span className="text-slate-600">
                {id ? "Edit Service" : "Add Service"}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Services</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-4 py-1.5 text-sm font-medium text-slate-600 border border-gray-200 rounded-md hover:bg-gray-50 transition"
              onClick={() => router.push("/Business/Services")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-1.5 text-sm font-semibold bg-[#1e4e8c] text-white rounded-md hover:bg-[#163d6e] transition shadow-sm"
            >
              Save
            </button>
          </div>
        </div>

        {/* ── Form ── */}
        <div className="max-w-7xl mx-auto py-4 md:py-6 px-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionRow
              left={{
                title: "Description",
                description: "Choose the name and description of this service.",
              }}
              right={
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label required>Service name</Label>
                      <Input
                        value={form.serviceName}
                        onChange={set("serviceName")}
                        placeholder="Service name"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={form.category}
                        onChange={(e) => {
                          console.log("VALUE:", e.target.value); // should be id
                          set("category")(e);
                        }}
                        options={categories.map((c) => ({
                          value: c.id,
                          label: c.label,
                        }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <textarea
                      value={form.description}
                      onChange={set("description")}
                      rows={3}
                      maxLength={500}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                    />
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      Characters left: {500 - descLen}
                    </p>
                  </div>
                </div>
              }
            />

            <SectionRow
              left={{ title: "Price" }}
              right={
                <div className="flex flex-col gap-2">
                  <div className="w-36">
                    <Select
                      value={form.priceType}
                      onChange={set("priceType")}
                      options={["Fixed price", "Free", "Variable"]}
                    />
                  </div>

                  {tiers.length === 0 && (
                    <LinkBtn
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:border-blue-500 hover:text-blue-600"
                    >
                      + Add Price Tier
                    </LinkBtn>
                  )}

                  {tiers.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-600 mb-1 w-[120px]">
                          Unassigned
                        </p>
                        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden w-36">
                          <span className="px-2.5 py-1.5 text-sm text-gray-500 bg-gray-50 border-r border-gray-200">
                            $
                          </span>
                          <input
                            type="text"
                            value={form.price || ""}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                            className="flex-1 px-2.5 py-1.5 text-sm text-slate-700 focus:outline-none"
                          />
                        </div>
                      </div>

                      {tiers.map((t) => (
                        <div key={t._id} className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-700 mb-1 w-[120px]">
                            {t.name}
                          </p>

                          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden w-36">
                            <span className="px-2.5 py-1.5 text-sm text-gray-500 bg-gray-50 border-r border-gray-200">
                              $
                            </span>
                            <input
                              type="text"
                              value={form.prices?.[t._id] || ""}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  prices: {
                                    ...prev.prices,
                                    [t._id]: e.target.value,
                                  },
                                }))
                              }
                              className="flex-1 px-2.5 py-1.5 text-sm text-slate-700 focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}

                      {/* Edit Button */}
                      <LinkBtn
                        onClick={() => setIsModalOpen(true)}
                        className="text-sm font-semibold text-blue-600 hover:underline mt-2"
                      >
                        Edit price tiers
                      </LinkBtn>
                    </div>
                  )}
                </div>
              }
            />

            <SectionRow
              left={{
                title: "Duration",
                description:
                  "You can add optional padding time for things like preparation or clean-up.",
              }}
              right={
                <div className="flex flex-col gap-3 items-start">
                  <div>
                    <Label required>Duration</Label>
                    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden w-40">
                      <span className="px-2.5 py-1.5 text-gray-500 bg-gray-50 border-r border-gray-200">
                        <Clock size={13} />
                      </span>
                      <Input
                        value={form.durationM}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            durationM: e.target.value,
                          }))
                        }
                        className="text-center"
                      />
                    </div>
                  </div>

                  {!form.isPaddingAndProcessing && (
                    <LinkBtn
                      onClick={handleTogglePadding}
                      className="text-blue-600 text-sm font-medium hover:underline "
                    >
                      Add padding and processing times
                    </LinkBtn>
                  )}
                </div>
              }
            />

            {form.isPaddingAndProcessing && (
              <SectionRow
                left={{
                  title: "Padding and processing times",

                  description:
                    "Padding time will block out additional time in your calendar. Processing time will create a free gap after the service.",
                }}
                right={
                  <div className="flex flex-col gap-3">
                    <div className="space-y-3">
                      <button
                        onClick={handleRemovePadding}
                        className="text-blue-600 text-sm font-medium hover:underline text-left"
                      >
                        Remove padding and processing times
                      </button>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden w-40">
                          <span className="px-2.5 py-1.5 text-gray-500 bg-gray-50 border-r border-gray-200">
                            <Clock size={13} />
                          </span>
                          <Input
                            value={form.paddingBeforeTime}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                paddingBeforeTime: e.target.value,
                              }))
                            }
                            className="text-center"
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          Padding before
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden w-40">
                          <span className="px-2.5 py-1.5 text-gray-500 bg-gray-50 border-r border-gray-200">
                            <Clock size={13} />
                          </span>
                          <Input
                            value={form.paddingAfterTime}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                paddingAfterTime: e.target.value,
                              }))
                            }
                            className="text-center"
                          />
                        </div>

                        <select className="text-black border border-gray-200 rounded-md px-2 py-1 text-sm">
                          <option>Padding after</option>
                          <option>Processing time</option>
                        </select>
                      </div>
                    </div>
                  </div>
                }
              />
            )}

            <SectionRow
              left={{ title: "Tax" }}
              right={
                <div className="flex flex-col gap-2">
                  <Label>Tax</Label>

                  <div className="w-28">
                    <Select
                      value={form.tax}
                      onChange={handleTaxChange}
                      options={["GST", "Not Applicable"]}
                    />
                  </div>

                  {form.tax !== "Not Applicable" && (
                    <Checkbox
                      checked={form.priceIncludesTax}
                      onChange={setCheck("priceIncludesTax")}
                      label="Price includes tax"
                    />
                  )}
                </div>
              }
            />

            <SectionRow
              left={{
                title: "Service colour",
                description:
                  "Choose the colour this service will use on the calendar.",
              }}
              right={
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer">
                    <img
                      src={COLOR_WHEEL_URL}
                      alt="color wheel"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    {/* Fallback rainbow div */}
                    <div
                      className="w-full h-full"
                      style={{
                        background:
                          "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-w-48">
                    {SERVICE_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, serviceColor: c }))
                        }
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full transition-transform ${
                          form.serviceColor === c
                            ? "ring-2 ring-offset-1 ring-blue-400 scale-110"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>
              }
            />

            <SectionRow
              left={{
                title: "Staff",
                description:
                  "Choose which staff members are able to perform this service.",
              }}
              right={
                <div className="flex flex-col gap-1.5">
                  {staff.map((s, key) => (
                    <Checkbox
                      key={key}
                      checked={!!form.selectedStaff[s._id]}
                      onChange={() => handleStaffToggle(s._id)}
                      label={s.fullname}
                    />
                  ))}
                </div>
              }
            />

            <SectionRow
              left={{
                title: "Resources",
                description: "Choose the resources required for this service.",
              }}
              right={
                <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-3">
                  <div className="w-4 h-4 rounded-full bg-[#1e4e8c] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] text-white font-bold">i</span>
                  </div>
                  <p className="text-[12px] text-blue-700 leading-relaxed">
                    You have no resources set up yet. Go to{" "}
                    <span className="font-semibold underline cursor-pointer">
                      Setup › Resources
                    </span>{" "}
                    to create a new resource.
                  </p>
                </div>
              }
            />

            <SectionRow
              left={{ title: "Online bookings" }}
              right={
                <div className="flex flex-col gap-2">
                  <Checkbox
                    checked={form.onlineBookings}
                    onChange={setCheck("onlineBookings")}
                    label="Clients can book this service online, or add them-selves to your waitlist"
                  />
                  <Checkbox
                    checked={form.vipOnly}
                    onChange={setCheck("vipOnly")}
                    label={
                      <span className="flex items-center gap-1">
                        Only VIP clients can book service
                        <Info size={11} className="text-gray-400" />
                      </span>
                    }
                    className="ml-5"
                  />
                  <Checkbox
                    checked={form.isVideoCall}
                    onChange={setCheck("isVideoCall")}
                    label={
                      <span className="flex items-center gap-1">
                        This service is a video call
                        <Info size={11} className="text-gray-400" />
                      </span>
                    }
                    className="ml-5"
                  />
                </div>
              }
            />

            <SectionRow
              left={{
                title: "Optional booking question",
                description:
                  "If you require specific information from the customer when this service is booked, enter the details here.",
              }}
              right={<LinkBtn>Add a booking question</LinkBtn>}
            />

            <SectionRow
              left={{
                title: "Online payments",
                description:
                  "Choose how customers can pay for online bookings.",
              }}
              right={
                <div className="flex flex-col gap-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentPolicy"
                      value="default"
                      checked={form.paymentPolicy === "default"}
                      onChange={set("paymentPolicy")}
                      className="mt-0.5 accent-[#1e4e8c]"
                    />
                    <span className="text-[12px] text-slate-600 leading-relaxed">
                      Use default payment policy. Requires payment of $99.00
                      deposit.{" "}
                      <span className="text-[#1e4e8c] underline cursor-pointer font-medium">
                        edit
                      </span>
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentPolicy"
                      value="custom"
                      checked={form.paymentPolicy === "custom"}
                      onChange={set("paymentPolicy")}
                      className="accent-[#1e4e8c]"
                    />
                    <span className="text-[12px] text-slate-600">
                      Use a different payment policy for this service
                    </span>
                  </label>
                  <div className="w-52 mt-1">
                    <Select
                      value={form.onlinePayment}
                      onChange={set("onlinePayment")}
                      options={[
                        {
                          value: "default",
                          label: "Do not accept online payments",
                        },
                        { value: "full", label: "Require full payment" },
                        { value: "deposit", label: "Require deposit" },
                      ]}
                    />
                  </div>
                </div>
              }
            />
          </div>

          <div className="flex items-center justify-end gap-2 py-5">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-slate-600 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition"
              onClick={() => router.push("/Business/Services")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 text-sm font-semibold bg-[#1e4e8c] text-white rounded-md hover:bg-[#163d6e] transition shadow-sm"
            >
              Save
            </button>
          </div>

          <PriceTierModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handlePriceTierSave}
            allStaff={staff}
            tiers={tiers}
            setTiers={setTiers}
          />
        </div>
      </div>
    </>
  );
}
