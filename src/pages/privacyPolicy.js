import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-10 px-4 md:px-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600">
            Privacy Policy
          </h1>
          <p className="text-gray-500 mt-2">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        {/* Sections */}
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
          We are committed to keeping your data safe and secure.
        </div>
      </div>
    </div>
  );
};

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "We may collect personal information such as your name, phone number, email address, and appointment details when you book our services.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "Your information is used to manage appointments, improve our services, communicate with you, and provide a better customer experience.",
  },
  {
    title: "3. Data Protection",
    content:
      "We take appropriate security measures to protect your personal data from unauthorized access, disclosure, or misuse.",
  },
  {
    title: "4. Sharing of Information",
    content:
      "We do not sell or share your personal information with third parties, except when required by law or for service delivery purposes.",
  },
  {
    title: "5. Cookies & Tracking",
    content:
      "Our website may use cookies to enhance user experience and analyze website traffic.",
  },
  {
    title: "6. Your Rights",
    content:
      "You have the right to access, update, or request deletion of your personal data by contacting us.",
  },
  {
    title: "7. Changes to Policy",
    content:
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page.",
  },
  {
    title: "8. Contact Us",
    content:
      "If you have any questions regarding this Privacy Policy, please contact us at our salon.",
  },
];

export default PrivacyPolicy;
