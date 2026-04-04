import AddCustomer from "@/components/AddCustomer";
import DashboardHeader from "@/components/DashboardHeader";
import { ConfirmModal } from "@/components/deleteModel";
import ImportCustomer from "@/components/ImportCustomer";
import { Api } from "@/services/service";
import {
  EllipsisVertical,
  MessageSquareText,
  Pencil,
  Trash,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useState } from "react";

const TABS = [
  "Summary",
  "Appointments",
  "Sales",
  "Products",
  "Notes",
  "Packages",
  "Credit",
  "Photos",
  "Documents",
  "Gift voucher",
  "Log",
];

function Avatar({ src, name, size = "md" }) {
  const sz = size === "lg" ? "w-28 h-28" : "w-9 h-9";
  return (
    <img
      src={
        src ||
        "https://api.dicebear.com/7.x/micah/svg?seed=sarah&backgroundColor=d1f4e0&radius=50"
      }
      alt={name}
      className={`${sz} rounded-full object-cover`}
    />
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span
        className={`text-sm font-medium ${highlight ? "text-blue-600" : "text-slate-800"}`}
      >
        {value}
      </span>
    </div>
  );
}

function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 min-h-[250px] shadow-sm p-4 ${className}`}
    >
      {children}
    </div>
  );
}
function Customers(props) {
  const [customerData, setCustomerData] = useState([]);
  const [selected, setSelected] = useState(customerData[0]);
  const [activeTab, setActiveTab] = useState("Summary");
  const [filterText, setFilterText] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getCustomer();
  }, [filterText]);

  useEffect(() => {
    if (customerData) {
      setSelected(customerData[0]);
    }
  }, [customerData]);

  useEffect(() => {
    if (selected && activeTab === "Appointments") {
      loadCustomerBookings();
    }
  }, [selected, activeTab]);

  const loadCustomerBookings = async () => {
    if (!selected?._id) return;
    
    try {
      setLoadingBookings(true);
      const res = await Api("get", `booking/getAll?customer=${selected._id}`, "", router);
      setLoadingBookings(false);
      
      if (res?.status) {
        const bookingsData = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setCustomerBookings(bookingsData);
      }
    } catch (err) {
      setLoadingBookings(false);
      console.error("Failed to load customer bookings", err);
    }
  };

  const getCustomer = async () => {
    props?.loader(true);

    try {
      const params = {
        role: "user",
        SalonManager: true,
        ...(filterText && { key: filterText }),
      };

      const res = await Api("get", `auth/getAllUser`, params, router);

      props.loader(false);

      if (res?.status === true) {
        setCustomerData(res.data?.data);
      } else {
        props.toaster({ type: "error", message: res?.message });
      }
    } catch (err) {
      props.loader(false);
      props.toaster({ type: "error", message: err?.message });
    }
  };

  const handleDeleteConfirm = () => {
    if (!editId) return;
    const id = editId;
    props.loader(true);
    Api("delete", `auth/deleteCustomer/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          props.toaster({
            type: "success",
            message: res?.data?.message || "Customer deleted successfully",
          });
          getCustomer();
          setEditId("");
          setIsConfirmOpen(false);
        } else {
          props.toaster({
            type: "success",
            message: res?.data?.message || "Failed to delete Customer",
          });
        }
      })
      .catch((err) => {
        props.loader(false);
        props.toaster({
          type: "error",
          message: err?.data?.message || "An error occurred",
        });
      });
  };

  return (
    <>
      <DashboardHeader title="Customers" />

      <div className="bg-custom-gray text-slate-800 flex  flex-col md:flex-row h-screen overflow-hidden">
        <aside className="md:w-[270px] w-full shrink-0 flex flex-col bg-white border-r border-slate-100">
          <div className="px-4 pt-5 pb-3">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900">Customers</h2>
              <span className="text-xs text-slate-400 font-medium">
                {customerData?.length}
              </span>
            </div>

            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50">
              <svg
                className="w-3.5 h-3.5 text-slate-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                />
              </svg>
              <input
                className="bg-transparent text-xs text-slate-600 placeholder-slate-400 outline-none w-full"
                placeholder="Filter customers..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {customerData.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-4 ${
                  selected?._id === c?._id
                    ? "bg-orange-50 border-orange-400"
                    : "border-transparent hover:bg-slate-50"
                }`}
              >
                <Avatar src={c?.photo} name={c?.fullname} size="sm" />
                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold truncate ${selected?._id === c?._id ? "text-slate-900" : "text-slate-700"}`}
                  >
                    {c?.fullname}
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {c.lastVisit
                      ? `Last visit: ${c.lastVisit}`
                      : c.status || ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex flex-col overflow-hidden">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-2 px-4 sm:px-8 py-3 sm:py-4 bg-white border-b border-slate-100 shrink-0">
            <button
              className="flex items-center justify-center gap-1.5 bg-custom-blue text-white text-xs sm:text-sm font-semibold px-3 py-2 sm:px-4 rounded-xl shadow hover:bg-custom-blue/90 transition-colors w-full sm:w-auto"
              onClick={() => setOpen(true)}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Customer
            </button>

            <button className="border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold px-3 py-2 sm:px-4 rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto"
            onClick={()=> setOpenCustomer(true)}
            >
              Import Customers
            </button>

            {/* Email */}
            <button
              className="border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold px-3 py-2 sm:px-4 rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto"
              onClick={() => router.push("/message/EmailMarketing")}
            >
              Send Marketing Email
            </button>
          </div>

          <div className="overflow-y-auto px-3 py-3 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <img
                src={
                  selected?.photo ||
                  "https://api.dicebear.com/7.x/micah/svg?seed=sarah&backgroundColor=d1f4e0&radius=50"
                }
                alt={selected?.fullname}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-md border-2 border-white"
              />

              <div className="flex-1">
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {selected?.fullname}
                </h1>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                  {selected?.customer_type && (
                    <span className="text-[10px] sm:text-xs font-bold text-custom-blue uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                      {selected?.customer_type} Customer
                    </span>
                  )}

                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                    ID: {selected?._id}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:ml-auto">
                <button
                  className="flex items-center gap-1 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    setOpen(true);
                    setEditId(selected?._id);
                  }}
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button className="flex items-center gap-1 bg-custom-blue text-white text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow hover:bg-custom-blue/90 transition-colors">
                  <MessageSquareText size={16} />
                  Messages
                </button>

                <div className="relative" ref={menuRef}>
                  {/* Button */}
                  <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="p-1.5 sm:p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <EllipsisVertical size={16} />
                  </button>

                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setOpen(true);
                          setEditId(selected?._id);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          // setOpen(false);
                          // onMessage();
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <MessageSquareText size={16} />
                        Message
                      </button>

                      <button
                        onClick={() => {
                          setIsConfirmOpen(true);
                          setEditId(selected._id);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible no-scrollbar border-b border-slate-200">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors border-b-[3px] -mb-px ${
                    activeTab === tab
                      ? "border-custom-blue text-custom-blue"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab} {tab === "Appointments" ? `(${customerBookings.length})` : tab !== "Summary" ? "(0)" : ""}
                </button>
              ))}
            </div>

            {activeTab === "Summary" && (
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Customer Information */}
                  <SectionCard>
                    <h3 className="text-base font-bold text-slate-900 mb-3">
                      Customer Information
                    </h3>
                    <InfoRow label="Telephone" value={selected?.telephone} />
                    <InfoRow
                      label="SMS number"
                      value={selected?.smsNumber}
                      highlight
                    />
                    <InfoRow label="Email" value={selected?.email} highlight />
                    <InfoRow label="Date created" value={selected?.createdAt} />
                  </SectionCard>

                  {/* Financial Summary */}
                  <SectionCard>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                        <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
                          Amount Owing
                        </p>
                        <p
                          className={`text-2xl font-black ${selected?.amountOwing === "$0.00" ? "text-orange-400" : "text-orange-600"}`}
                        >
                          {selected?.amountOwing}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
                          Credit Amount
                        </p>
                        <p className="text-2xl font-black text-blue-600">
                          {selected?.creditAmount}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-0 divide-y divide-slate-100">
                      <div className="flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <svg
                            className="w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          Saved Cards
                        </div>
                        <span className="text-sm font-semibold text-slate-800">
                          {selected?.savedCards}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <svg
                            className="w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                          </svg>
                          Notifications
                        </div>
                        <span className="text-sm font-semibold text-slate-800">
                          {selected?.notifications}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <svg
                            className="w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Reminders
                        </div>
                        <span className="text-sm font-semibold text-slate-800">
                          {selected?.reminders}
                        </span>
                      </div>
                    </div>
                  </SectionCard>
                </div>

                <div className="space-y-4">
                  <SectionCard>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-slate-900">
                        Appointments
                      </h3>
                      <div className="flex items-center gap-2">
                        <button className="text-sm font-semibold text-blue-600 hover:underline">
                          View all appointments
                        </button>
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Last Appointment
                        </p>
                        <p className="text-base font-bold text-slate-700">
                          {selected?.lastAppointment}
                        </p>
                      </div>
                      <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Next Appointment
                        </p>
                        <p className="text-base font-bold text-slate-700">
                          {selected?.nextAppointment}
                        </p>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Sales */}
                  <SectionCard>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-slate-900">
                        Sales
                      </h3>
                      <div className="flex items-center gap-2">
                        <button className="text-sm font-semibold text-blue-600 hover:underline">
                          View all invoices
                        </button>
                        <button className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          />
                        </svg>
                      </div>
                    </div>
                    {!selected?.unpaidInvoices ? (
                      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                        <svg
                          className="w-10 h-10 mb-3 text-slate-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-sm text-slate-400">
                          There are no unpaid invoices for this customer
                        </p>
                      </div>
                    ) : (
                      <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-sm text-orange-700 font-medium">
                        Outstanding invoice: {selected?.amountOwing}
                      </div>
                    )}
                  </SectionCard>

                  <SectionCard>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-slate-900">
                        Notes
                      </h3>
                      <div className="flex items-center gap-2">
                        <button className="text-sm font-semibold text-blue-600 hover:underline">
                          View all notes
                        </button>
                        <svg
                          className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        <svg
                          className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          />
                        </svg>
                      </div>
                    </div>
                    {!selected?.notes ? (
                      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                        <svg
                          className="w-10 h-10 mb-3 text-slate-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        <p className="text-sm text-slate-400">
                          No notes have been recorded for this customer
                        </p>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm text-slate-700">
                        Prefers morning appointments. Has sensitive scalp — use
                        gentle products only.
                      </div>
                    )}
                  </SectionCard>
                </div>
              </div>
            )}

            {activeTab !== "Summary" && activeTab !== "Appointments" && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <svg
                  className="w-12 h-12 mb-3 text-slate-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm">{activeTab} content coming soon</p>
              </div>
            )}

            {activeTab === "Appointments" && (
              <div className="space-y-4">
                {loadingBookings ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-blue mb-4"></div>
                    <p className="text-sm text-slate-600">Loading appointments...</p>
                  </div>
                ) : customerBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <svg
                      className="w-12 h-12 mb-3 text-slate-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm">No appointments found for this customer</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {customerBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                booking.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {booking.status}
                              </span>
                              <span className="text-sm font-semibold text-slate-800">
                                {new Date(booking.date).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <p className="text-base font-bold text-slate-900 mb-1">
                              {booking.service}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span>
                                Staff: {booking.staff?.fullname || "Unassigned"}
                              </span>
                              <span>
                                Time: {booking.startHour === 12 ? "12:00 PM" : booking.startHour < 12 ? `${booking.startHour}:00 AM` : `${booking.startHour - 12}:00 PM`}
                              </span>
                              <span>
                                Duration: {booking.durationMins} mins
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-slate-900">
                              ${booking.price || 0}
                            </p>
                          </div>
                        </div>
                        {booking.notes && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <p className="text-sm text-slate-600">{booking.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {open && (
          <AddCustomer
            onClose={() => setOpen(false)}
            loader={props.loader}
            toaster={props.toaster}
            editId={editId}
            setEditId={setEditId}
            getCustomer={getCustomer}
            shouldRefresh={true}
          />
        )}

        <ConfirmModal
          isOpen={isConfirmOpen}
          setIsOpen={setIsConfirmOpen}
          title="Delete Customer"
          message={`Are you sure you want to delete this Customer ?`}
          onConfirm={handleDeleteConfirm}
          yesText="Yes, Delete"
          noText="Cancel"
        />
        {openCustomer && (
          <ImportCustomer
            onClose={() => setOpenCustomer(false)}
            loader={props.loader}
            toaster={props.toaster}
          />
        )}
      </div>
    </>
  );
}

export default Customers;
