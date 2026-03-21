import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-10 px-4 md:px-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600">
            Terms of Service
          </h1>
          <p className="text-gray-500 mt-2">
            Please read these terms carefully before using our salon services.
          </p>
        </div>

        {/* Section Component */}
        {sections.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-500 mb-3">
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </div>
        ))}

        {/* Footer */}
        <div className="mt-10 border-t pt-6 text-center text-gray-500 text-sm">
          Thank you for choosing our salon. We look forward to serving you!
        </div>
      </div>
    </div>
  );
};

const sections = [
  {
    title: "1. Services",
    content:
      "We provide professional beauty and wellness services including hair care, skincare, and body treatments. All services are delivered by trained professionals.",
  },
  {
    title: "2. Appointments",
    content:
      "Appointments can be booked online or in person. Please arrive 10 minutes early. Late arrivals may lead to reduced service time or rescheduling.",
  },
  {
    title: "3. Cancellations & Rescheduling",
    content:
      "Appointments should be canceled at least 24 hours in advance. Late cancellations or no-shows may incur charges.",
  },
  {
    title: "4. Payments",
    content:
      "All services must be paid after completion. We accept cash, UPI, and cards. Prices may change without prior notice.",
  },
  {
    title: "5. Health & Safety",
    content:
      "Please inform us about allergies or medical conditions before your service. We are not responsible for reactions if not disclosed.",
  },
  {
    title: "6. Personal Belongings",
    content:
      "We are not responsible for lost or damaged personal belongings. Please take care of your valuables.",
  },
  {
    title: "7. Refund Policy",
    content:
      "Services once completed are non-refundable. If unsatisfied, inform us immediately so we can assist.",
  },
  {
    title: "8. Conduct",
    content:
      "Clients are expected to behave respectfully. Misconduct may result in refusal of service.",
  },
  {
    title: "9. Changes to Terms",
    content:
      "We may update these terms at any time without prior notice.",
  },
  {
    title: "10. Contact",
    content:
      "For any queries, please contact us directly at the salon.",
  },
];

export default TermsOfService;