import DashboardHeader from "@/components/DashboardHeader";
import React from "react";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import isAuth from "@/components/isAuth";

const REPORTS = {
  Stock: [
    {
      title: "Stock movement",
      description:
        "This report details all changes made to retail and professional stock levels within a given date range, allowing you to keep track of all the products coming in and out of your business.",
    },
    {
      title: "Stock levels",
      description:
        "View a list of all your products including current stock levels.",
    },
  ],
  Appointments: [
    {
      title: "Day sheet",
      description:
        "Run off a list of appointments for today, or a longer period as required. Can be filtered by staff or location.",
    },
    {
      title: "Appointment schedule",
      description:
        "A full list of all of your appointments for a selected time period. Great for a backup or to import into other systems.",
    },
    {
      title: "Cancelled appointments",
      description:
        "Run this report for a selected time period to view a list of all of the cancelled appointments. Includes date cancelled and cancellation reason.",
    },
    {
      title: "Incomplete appointments",
      description:
        "View appointments that have not been marked as completed. Great for finding missing appointments to tick off at the end of the day.",
    },
    {
      title: "No-show appointments",
      description:
        "View a list of appointments where the customer did not show. Includes a count of the number of times the customer has failed to show.",
    },
    {
      title: "Pencilled-in appointments",
      description:
        "Run this report to view appointments still in pencilled-in status.",
    },
    {
      title: "Declined appointments",
      description:
        "View a list of appointments requested by customers through online bookings that you declined.",
    },
  ],
};

const SECTION_ICONS = {
  Stock: (
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
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  Appointments: (
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
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  Staff: (
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
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
};

function toColumns(items, cols) {
  const columns = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => columns[i % cols].push(item));
  return columns;
}

function ReportItem({ title, description }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-custom-blue mb-1 cursor-pointer hover:underline">
        {title}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
      <span className="text-slate-500">{icon}</span>
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
    </div>
  );
}

function Reports() {
  const [selectedReport, setSelectedReport] = useState("");
  const [dateRange] = useState("Oct 1, 2023 - Oct 31, 2023");

  const appointmentCols = toColumns(REPORTS.Appointments, 3);
  const stockCols = toColumns(REPORTS.Stock, 3);

  const [show, setShow] = useState(false);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const formatted =
    format(range[0].startDate, "MMM d, yyyy") +
    " - " +
    format(range[0].endDate, "MMM d, yyyy");
  return (
    <>
      <DashboardHeader title="Reports" />

      <div className="min-h-screen bg-custom-gray text-slate-800 ">
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-3 px-6 py-3">
          {/* Report Selector */}
          <div className="relative">
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="appearance-none w-full border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-sm text-slate-600 bg-white cursor-pointer outline-none hover:border-slate-400 transition-colors"
            >
              <option value="">Choose a report</option>
              {Object.entries(REPORTS).flatMap(([section, items]) =>
                items.map((r) => (
                  <option key={r.title} value={r.title}>
                    {r.title}
                  </option>
                )),
              )}
            </select>
            <svg
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div className="relative inline-block">
            {/* Input UI */}
            <div
              onClick={() => setShow(!show)}
              className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-600 bg-white cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatted}</span>
            </div>

            {/* Calendar */}
            {show && (
              <div className="absolute z-50 mt-2 shadow-lg">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={range}
                />
              </div>
            )}
          </div>

          {/* View Report */}
          <button className="bg-custom-blue text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-800 transition-colors shadow-sm">
            View Report
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
          <section>
            <SectionHeader icon={SECTION_ICONS.Stock} title="Stock" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stockCols.map((col, ci) => (
                <div key={ci}>
                  {col.map((item) => (
                    <ReportItem key={item.title} {...item} />
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader
              icon={SECTION_ICONS.Appointments}
              title="Appointments"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {appointmentCols.map((col, ci) => (
                <div key={ci}>
                  {col.map((item) => (
                    <ReportItem key={item.title} {...item} />
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader icon={SECTION_ICONS.Staff} title="Staff" />
            <div className="border-2 border-dashed border-slate-200 rounded-xl py-12 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 12h.01M12 12h.01M19 12h.01"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-1">
                More reports coming soon
              </p>
              <p className="text-sm text-slate-400 max-w-xs">
                We're currently building out the staff performance and
                productivity reports for your dashboard.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default isAuth(Reports);
