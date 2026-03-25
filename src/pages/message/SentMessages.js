import DashboardHeader from "@/components/DashboardHeader";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import { Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import ContactModal from "@/components/ContactModel";
import SMSTable from "@/components/SMSTable";


const MOCK_MESSAGES = [
  {
    id: 1,
    date: "13 Mar 2026",
    time: "4:55PM",
    customerName: "Samantha Hajjar",
    customerId: "c1",
    phone: "61404895874",
    email: "samantha@example.com",
    bookingId: "b1",
    sendto: "61404895874",
    message: "Okay thank you",
  },
  {
    id: 2,
    date: "13 Mar 2026",
    time: "4:30PM",
    customerName: "Samantha Hajjar",
    customerId: "c1",
    phone: "61404895874",
    email: "samantha@example.com",
    bookingId: null,
    sendto: "61404895874",
    message: "20th",
  },
  {
    id: 3,
    date: "13 Mar 2026",
    time: "4:30PM",
    customerName: "Samantha Hajjar",
    customerId: "c1",
    phone: "61404895874",
    email: "samantha@example.com",
    bookingId: null,
    sendto: "61404895874",
    message: "Oh okay can we the Friday at 10am ple...",
  },
  {
    id: 4,
    date: "13 Mar 2026",
    time: "2:12PM",
    customerName: "Samantha Hajjar",
    customerId: "c1",
    phone: "61404895874",
    email: "samantha@example.com",
    bookingId: null,
    sendto: "61404895874",
    message: "Can we do Monday or Tuesday 23rd or 24th either one of those day",
  },
  {
    id: 5,
    date: "13 Mar 2026",
    time: "6:02AM",
    customerName: "Samantha Hajjar",
    customerId: "c1",
    phone: "61404895874",
    email: "samantha@example.com",
    bookingId: "b2",
    sendto: "61404895874",
    message:
      "Am I able to change this appointment I didn't realise until after I booked I had something on",
  },
  {
    id: 6,
    date: "7 Mar 2026",
    time: "12:05PM",
    customerName: "Shaheena Dean",
    customerId: "c2",
    phone: "61435982276",
    email: "shaheena@example.com",
    bookingId: "b3",
    sendto: "61435982276",
    message:
      "Hi this is Shaheena, I am running late for my appt as I have taken a wrong turn",
  },
  {
    id: 7,
    date: "6 Mar 2026",
    time: "1:05PM",
    customerName: "Pravina Poudel Bhusal",
    customerId: "c3",
    phone: "61449968761",
    email: "pravina@example.com",
    bookingId: "b4",
    sendto: "61449968761",
    message: "STOP",
  },
    {
    id: 7,
    date: "6 Mar 2026",
    time: "1:05PM",
    customerName: "Pravina Poudel Bhusal",
    customerId: "c3",
    phone: "61449968761",
    email: "pravina@example.com",
    bookingId: "b4",
    sendto: "61449968761",
    message: "STOP",
  },
    {
    id: 7,
    date: "6 Mar 2026",
    time: "1:05PM",
    customerName: "Pravina Poudel Bhusal",
    customerId: "c3",
    phone: "61449968761",
    email: "pravina@example.com",
    bookingId: "b4",
    sendto: "61449968761",
    message: "STOP",
  },
    {
    id: 7,
    date: "6 Mar 2026",
    time: "1:05PM",
    customerName: "Pravina Poudel Bhusal",
    customerId: "c3",
    phone: "61449968761",
    email: "pravina@example.com",
    bookingId: "b4",
    sendto: "61449968761",
    message: "STOP",
  },
    {
    id: 7,
    date: "6 Mar 2026",
    time: "1:05PM",
    customerName: "Pravina Poudel Bhusal",
    customerId: "c3",
    phone: "61449968761",
    email: "pravina@example.com",
    bookingId: "b4",
    sendto: "61449968761",
    message: "STOP",
  },
    {
    id: 7,
    date: "6 Mar 2026",
    time: "1:05PM",
    customerName: "Pravina Poudel Bhusal",
    customerId: "c3",
    phone: "61449968761",
    email: "pravina@example.com",
    bookingId: "b4",
    sendto: "61449968761",
    message: "STOP",
  },
    {
    id: 7,
    date: "6 Mar 2026",
    time: "1:05PM",
    customerName: "Pravina Poudel Bhusal",
    customerId: "c3",
    phone: "61449968761",
    email: "pravina@example.com",
    bookingId: "b4",
    sendto: "61449968761",
    message: "STOP",
  },
];

const PAGE_SIZE = 10;

function SentMessages(props) {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [contactTarget, setContactTarget] = useState(null); // opens modal
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getMessages();
  }, [filterText]);

  const getMessages = async () => {
    props?.loader?.(true);
    setLoading(true);
    try {
      const params = { ...(filterText && { key: filterText }) };
      const res = await Api("get", "SMS/getAllMessage", params, router);
      props?.loader?.(false);
      setLoading(false);
      if (res?.status === true) {
        setAllMessages(res.data?.data || []);
      } else {
        setAllMessages(MOCK_MESSAGES);
      }
    } catch (err) {
      props?.loader?.(false);
      setLoading(false);
      setAllMessages(MOCK_MESSAGES);
    }
  };

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = allMessages.filter((m) => {
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    return (
      m.customerName?.toLowerCase().includes(q) ||
      m.sendto?.includes(q) ||
      m.message?.toLowerCase().includes(q)
    );
  });

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // ── Selection helpers ──────────────────────────────────────────────────────
  const handleToggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const handleToggleAll = () =>
    setSelectedIds(
      selectedIds.length === paginated.length ? [] : paginated.map((m) => m.id),
    );

  // ── Reply / Modal ──────────────────────────────────────────────────────────
  const handleReply = (msg) => {
    setContactTarget({
      id: msg.customerId,
      name: msg.customerName,
      phone: msg.phone?.replace(/^61/, ""),
      email: msg.email,
    });
  };

  return (
    <>
      <DashboardHeader title="SMS Inbox" />

      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-5 py-5">
        {/* ── Toolbar ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-2 mb-3">
          {/* Refresh */}
          <button
            onClick={getMessages}
            className="p-2 rounded border border-slate-300 bg-white hover:bg-slate-50 transition-colors shadow-sm"
            title="Refresh"
          >
            <RefreshCw
              size={15}
              className={`text-slate-500 ${loading ? "animate-spin" : ""}`}
            />
          </button>

          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name, phone number, etc"
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 rounded border border-slate-300 bg-white text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-72"
            />
          </div>
        </div>

        <SMSTable
          messages={paginated}
          onReply={handleReply}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleAll={handleToggleAll}
          actiontrue={false}
        />

        <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
          <span>
            Showing {Math.min(filtered.length, PAGE_SIZE)} of {filtered.length}{" "}
            messages
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded border text-xs font-semibold transition-colors ${
                  p === currentPage
                    ? "bg-custom-blue text-white border-custom-blue"
                    : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>


      {contactTarget && (
        <ContactModal
          contact={contactTarget}
          onClose={() => setContactTarget(null)}
          toaster={props?.toaster}
          loader={props?.loader}
        />
      )}
    </>
  );
}

export default SentMessages;

