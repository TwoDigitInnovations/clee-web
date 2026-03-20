import DashboardHeader from "@/components/DashboardHeader";
import React from "react";

function Calender() {
  return (
    <>
      <DashboardHeader
        title="Calender"
        subtitle="To manage appointments, staff availability, and customer bookings."
      />

      <div className="min-h-screen bg-custom-gray p-6 text-slate-800 "></div>
    </>
  );
}

export default Calender;
