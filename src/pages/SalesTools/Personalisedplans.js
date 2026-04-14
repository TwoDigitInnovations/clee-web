"use client";
import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Users,
  TrendingUp,
  Wallet,
  Megaphone,
  Filter,
  Download,
  Mail,
  MessageSquare,
  Phone,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ConfirmModal } from "@/components/deleteModel";

function Personalisedplans() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const stats = [
    {
      title: "Active Custom Plans",
      value: "1,284",
      grow: "+12%",
      icon: <Wallet className="text-blue-600" size={20} />,
    },
    {
      title: "Client Retention",
      value: "94.8%",
      grow: "+5.2%",
      icon: <Users className="text-blue-600" size={20} />,
    },
    {
      title: "Avg. Plan Value",
      value: "$4,520",
      grow: "-0.8%",
      icon: <TrendingUp className="text-blue-600" size={20} />,
      negative: true,
    },
    {
      title: "Marketing Reach",
      value: "8.2k",
      grow: "+24%",
      sub: "/mo",
      icon: <Megaphone className="text-blue-600" size={20} />,
    },
  ];

  // Table Data based on Screenshot
  const records = [
    {
      id: 1,
      name: "Elena Vance",
      email: "elena.v@example.com",
      plan: "6-Month Revitalisation",
      renew: "12 Oct 2023",
      status: "Active",
      history: "Email: Welcome Pack",
      time: "2d ago",
      icon: <Mail size={14} />,
    },
    {
      id: 2,
      name: "Marcus Thorne",
      email: "m.thorne@firm.net",
      plan: "Quarterly Maintenance",
      renew: "01 Nov 2023",
      status: "Pending",
      history: "SMS: Booking Reminder",
      time: "1h ago",
      icon: <MessageSquare size={14} />,
    },
    {
      id: 3,
      name: "Julian S. Hayes",
      email: "jhayes@corp.org",
      plan: "Premium Annual Suite",
      renew: "15 Oct 2023",
      status: "Completed",
      history: "Email: Feedback Survey",
      time: "3w ago",
      icon: <Mail size={14} />,
    },
    {
      id: 4,
      name: "Sarah Chen",
      email: "schen.creative@web.com",
      plan: "6-Month Revitalisation",
      renew: "05 Nov 2023",
      status: "Active",
      history: "Call: Follow-up Check",
      time: "Yesterday",
      icon: <Phone size={14} />,
    },
  ];

  const handleDeleteConfirm = async () => {
    try {
      console.log("Deleting Plan ID:", selectedId);
      // Actual API call yahan aayegi:
      // await dispatch(deletePlanAction(selectedId));
      setOpen(false);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="bg-[#f8f9fc] min-h-screen font-sans text-slate-700">
      <DashboardHeader title="Sales Tools" />

      <div className="md:p-6 p-4 max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-custom-blue">
            Custom Personalised Plans
          </h1>
          <button
            className="bg-custom-blue hover:bg-custom-blue/90 text-white px-5 py-2.5 rounded-md flex items-center gap-2 w-fit text-sm font-semibold transition-all shadow-md"
            onClick={() => router.push("/SalesTools/AddPersonalisedplans")}
          >
            <Plus size={18} /> Add New Plan
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">{stat.icon}</div>
                <span
                  className={`text-[11px] font-bold flex items-center gap-1 ${stat.negative ? "text-red-500" : "text-orange-500"}`}
                >
                  {stat.grow}
                </span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-custom-blue">
                {stat.value}
                <span className="text-sm text-gray-400 ml-1">{stat.sub}</span>
              </h3>
            </div>
          ))}
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-custom-blue">
                Active Client Records
              </h2>
              <p className="text-sm text-gray-500">
                Manage personalized procedure lifecycles and marketing touches.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg border border-gray-200">
                <Filter size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg border border-gray-200">
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4">Client Details</th>
                  <th className="px-6 py-4">Assigned Plan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Marketing History</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-custom-blue">
                            {row.name}
                          </p>
                          <p className="text-xs text-gray-400">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">
                        {row.plan}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Renewed: {row.renew}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                          row.status === "Active"
                            ? "bg-orange-50 text-orange-600"
                            : row.status === "Pending"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            row.status === "Active"
                              ? "bg-orange-600"
                              : row.status === "Pending"
                                ? "bg-blue-600"
                                : "bg-gray-500"
                          }`}
                        />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{row.icon}</span>
                        <p className="text-xs text-gray-600">{row.history}</p>
                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400">
                          {row.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 border border-gray-100 rounded-lg hover:bg-blue-50 transition-all">
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedId(row.id);
                            setOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 border border-gray-100 rounded-lg hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
            <p>Showing 1-10 of 1,284 records</p>
            <div className="flex items-center gap-4">
              <ChevronLeft
                size={18}
                className="cursor-pointer hover:text-blue-600"
              />
              <span className="text-blue-600 font-bold">1</span>
              <ChevronRight
                size={18}
                className="cursor-pointer hover:text-blue-600"
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={open}
        setIsOpen={setOpen}
        title="Delete Plan"
        message="Are you sure you want to delete this personalised plan? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />
    </div>
  );
}

export default Personalisedplans;
