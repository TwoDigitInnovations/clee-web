import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Info,
  Search,
  Database,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Api } from "@/services/service";
import { useRouter } from "next/navigation";
const dummyMessages = [
  {
    _id: "1",
    app: "Shopify",
    type: "Order Sync",
    details: "Order synced successfully",
    attempts: 1,
    status: "Success",
  },
  {
    _id: "2",
    app: "Stripe",
    type: "Payment",
    details: "Payment failed",
    attempts: 3,
    status: "Failed",
  },
];

function IntegrationMessages() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy Data
  // Khali array rakha hai "No matching records found" dikhane ke liye
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await Api("get", "integration/messages", "", router);

        if (res.data?.data?.length > 0) {
          setMessages(res.data.data);
        } else {
          setMessages(dummyMessages); // ✅ fallback
        }
      } catch (error) {
        console.log("API Error:", error);
        setMessages(dummyMessages); // ✅ fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);
  return (
    <>
      <DashboardHeader title="Your Business" />

      <div className="min-h-screen bg-[#f0f2f5] text-slate-800 px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Title Section */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#1a365d]">
              Integration messages
            </h1>
            <p className="text-sm text-slate-600">
              This page shows the details of messages sent to your integrations.
              To view messages with errors only
              <button className="text-blue-700 font-bold ml-1 hover:underline">
                click here
              </button>
              .
            </p>
          </div>

          {/* Alert Box */}
          <div className="bg-[#eaf3f8] border-l-4 border-[#1a4a8d] p-4 rounded-r-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-[#1a4a8d] shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-relaxed">
              These messages are automatically generated, so if you're unsure of
              what they mean, get in touch with us on
              <a
                href="#"
                className="text-blue-700 ml-1 hover:underline break-all"
              >
                https://help.getClee.com/hc/en-gb/requests/new
              </a>
            </p>
          </div>

          {/* Table Container Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            {/* Table Controls (Show entries & Search) */}
            <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Show</span>
                <div className="relative">
                  <select className="appearance-none bg-slate-100 border border-slate-200 rounded px-4 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                </div>
                <span>entries</span>
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#f0f2f5] border-none rounded-md py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>

            {/* Responsive Table Area */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">App</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Attempts</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Resolve Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Database
                            className="w-12 h-12 mb-2 opacity-30"
                            strokeWidth={1.5}
                          />
                          <span className="text-lg font-medium">
                            No matching records found
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    messages.map((msg) => (
                      <tr key={msg._id} className="border-b">
                        <td className="px-6 py-4">{msg._id}</td>
                        <td className="px-6 py-4">{msg.app}</td>
                        <td className="px-6 py-4">{msg.type}</td>
                        <td className="px-6 py-4">{msg.details}</td>
                        <td className="px-6 py-4">{msg.attempts}</td>
                        <td className="px-6 py-4">{msg.status}</td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:underline">
                            Resolve
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="p-4 bg-white border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-500">
                Showing 0 to 0 of 0 entries{" "}
                <span className="text-xs">
                  (filtered from 1,784 total entries)
                </span>
              </p>

              <div className="flex items-center gap-1">
                <button className="px-4 py-2 text-sm font-semibold text-slate-400 bg-slate-100 rounded-md cursor-not-allowed">
                  Previous
                </button>
                <button className="px-4 py-2 text-sm font-semibold text-slate-400 bg-slate-100 rounded-md cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default IntegrationMessages;
