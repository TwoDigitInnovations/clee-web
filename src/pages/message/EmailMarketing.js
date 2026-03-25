import DashboardHeader from "@/components/DashboardHeader";
import React from "react";
import { Mail } from "lucide-react";

function EmailMarketing() {
  const handleGetStarted = () => {
    window.open("https://mailchimp.com", "_blank");
  };

  return (
    <>
      <DashboardHeader title="Email Marketing" />

      <div className="min-h-screen bg-[#f0f1f5] text-slate-800 px-6 py-6">

        {/* Page title + divider */}
        <h1 className="text-xl font-semibold text-blue-700 mb-3">
          Email campaigns
        </h1>
        <hr className="border-slate-300 mb-6" />

        {/* Content block */}
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Spread the word with email marketing
          </h2>

          <p className="text-sm text-slate-600 mb-4">
            Need to send an email blast to your customers? No problem!
          </p>

          <p className="text-sm text-slate-600 mb-7 leading-relaxed">
            We've partnered with MailChimp to provide you with the
            industry-standard email marketing solution. Sync your customers to
            MailChimp then design and send beautiful newsletters. It couldn't
            be easier!
          </p>

          {/* CTA button */}
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-custom-blue hover:bg-custom-blue/90 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Mail size={15} />
            Get started with MailChimp
          </button>
        </div>
      </div>
    </>
  );
}

export default EmailMarketing;