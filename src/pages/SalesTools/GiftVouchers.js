import DashboardHeader from "@/components/DashboardHeader";
import { Api } from "@/services/service";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function GiftVouchers() {
  const router = useRouter();
  return (
    <>
      <DashboardHeader title="Sales Tools" />

      <div className="md:p-6 p-4 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-custom-blue">
            Gift vouchers
          </h1>
          <div className="flex gap-2 ">
            <button
              className="bg-custom-blue text-white px-4 py-2 rounded text-sm font-medium hover:bg-custom-blue/90 flex items-center gap-2"
              onClick={() => router.push("/SalesTools/SearchVouchers")}
            >
              Search Voucher code
            </button>

            <button
              className="bg-custom-blue text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 flex items-center gap-2"
              //   onClick={() => router.push("/SalesTools/AddPromoCode")}
            >
              Save
            </button>
          </div>
        </div>{" "}
      </div>
    </>
  );
}

export default GiftVouchers;
