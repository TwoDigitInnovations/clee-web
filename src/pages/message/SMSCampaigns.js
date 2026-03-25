import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/router";

const MOCK_MESSAGES = [
  {
    id: 1,
    message:
      "I just wanted to tell you that you'll receive a Complimentary Saffron Serum Valued at $199 for all Appointments booked from this Thursday-Saturday at Chebo Clinic For Valentines Week. Book Here: https://bookings.getclee.com/cheboclinic/book",
    sent: "Wed 11 Feb",
    to: "310 customers",
    messageCost: "$0.24",
    campaignCost: "$74.40",
  },
  {
    id: 2,
    message:
      "Hey, It's Chebo Clinic. Do you remember us telling you about the The New Sheer Tinted Zinc Cream that was coming? It just landed. Lightweight, softly tinted, and made to last all day.",
    sent: "Tue 1 Apr",
    to: "107 customers",
    messageCost: "$0.36",
    campaignCost: "4 SMS credits + $38.04",
  },
  {
    id: 3,
    message:
      "Get a FREE Celebrity Multivitamin Peel + LED valued at $349 with every HIFU or Mesotherapy procedure!",
    sent: "Tue 10 Dec",
    to: "807 customers",
    messageCost: "$0.24",
    campaignCost: "$193.68",
  },
  {
    id: 4,
    message:
      "New Copper Peptide Jelly Cleanser Alert! Gentle and Hydrating! Perfect for All Skin Types.",
    sent: "Tue 22 Oct",
    to: "281 customers",
    messageCost: "$0.24",
    campaignCost: "$67.44",
  },
];

// ---------------- INFO BANNER ----------------
const InfoBanner = () => (
  <div className="mt-4 bg-slate-100 border rounded-md p-4 flex gap-3">
    <Info size={18} className="text-slate-600 mt-1" />
    <div className="text-sm text-slate-600">
      <p className="font-medium mb-2">
        SMS campaign costs will depend on the length of your message
      </p>
      <p>Regular $0.12 (up to 138 characters)</p>
      <p>Large $0.24 (up to 284 characters)</p>
      <p>Grande $0.36 (up to 437 characters)</p>
    </div>
  </div>
);

// ---------------- TABLE ROW ----------------
const CampaignRow = ({ item }) => (
  <div className="grid grid-cols-12 gap-4 px-4 py-4 border-t text-sm text-slate-700">
    <div className="col-span-5 text-slate-600 leading-relaxed">
      {item.message}
    </div>
    <div className="col-span-2">{item.sent}</div>
    <div className="col-span-2">{item.to}</div>
    <div className="col-span-1">{item.messageCost}</div>
    <div className="col-span-2 font-medium">{item.campaignCost}</div>
  </div>
);

// ---------------- TABLE ----------------
const CampaignTable = ({ data }) => (
  <div className="mt-4 border rounded-md overflow-hidden">
    <div className="grid grid-cols-12 gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
      <div className="col-span-5">Previous Campaigns</div>
      <div className="col-span-2">Sent</div>
      <div className="col-span-2">To</div>
      <div className="col-span-1">Message Cost</div>
      <div className="col-span-2">Campaign Cost</div>
    </div>

    {data.map((item) => (
      <CampaignRow key={item.id} item={item} />
    ))}
  </div>
);


export default function SMSCampaigns() {
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const PAGE_SIZE = 3;

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      setAllMessages(MOCK_MESSAGES);
    } catch (err) {
      setAllMessages(MOCK_MESSAGES);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(allMessages.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = allMessages.slice(start, start + PAGE_SIZE);

  return (
    <>
    
     <DashboardHeader title="SMS Campaigns" />
      <div className="p-6 bg-gray-50 min-h-screen">
     
      <div className="flex justify-end py-2">
        <button
          className="bg-custom-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-custom-blue/90"
          onClick={() => router.push("/message/NewSmsCampaigns")}
        >
          New SMS Campaign
        </button>
      </div>
      <InfoBanner />

      {loading ? (
        <div className="mt-6 text-sm text-slate-500">Loading...</div>
      ) : (
        <CampaignTable data={paginated} />
      )}

      <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
        <span>
          Showing {paginated.length} of {allMessages.length} messages
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-8 h-8 rounded border text-xs font-semibold ${
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
            className="p-1.5 rounded border border-slate-300 bg-white disabled:opacity-40 hover:bg-slate-50"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
     </>
   
  );
}
