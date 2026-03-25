import React, { useState } from "react";
import { X, Mail, Phone, Send } from "lucide-react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";

function ContactModal({ contact, onClose, toaster, loader }) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("sms");

  const [smsNumber, setSmsNumber] = useState(contact?.phone || "");
  const [smsMessage, setSmsMessage] = useState("");
  const SMS_LIMIT = 160;

  const [emailAddress, setEmailAddress] = useState(contact?.email || "");
  const [emailMessage, setEmailMessage] = useState("");
  const EMAIL_LIMIT = 1000;

  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const err = {};
    if (activeTab === "sms") {
      if (!smsNumber.trim()) err.smsNumber = "Phone number required";
      if (!smsMessage.trim()) err.smsMessage = "Message required";
    }
    if (activeTab === "email") {
      if (!emailAddress.trim()) err.email = "Email required";
      else if (!/\S+@\S+\.\S+/.test(emailAddress)) err.email = "Invalid email";
      if (!emailMessage.trim()) err.emailMessage = "Message required";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setSending(true);
    loader?.(true);
    try {
      const payload =
        activeTab === "sms"
          ? { type: "sms", to: smsNumber, message: smsMessage, customerId: contact?.id }
          : { type: "email", to: emailAddress, message: emailMessage, customerId: contact?.id };

      const res = await Api("post", "SMS/sendMessage", payload, router);
      loader?.(false);
      setSending(false);

      if (res?.status) {
        toaster?.({ type: "success", message: "Message sent successfully!" });
        onClose();
      } else {
        toaster?.({ type: "error", message: res?.message });
      }
    } catch (err) {
      loader?.(false);
      setSending(false);
      toaster?.({ type: "error", message: err?.message });
    }
  };

  const avatar = contact?.name?.[0]?.toUpperCase() || "?";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[440px] bg-white rounded-[20px] md:rounded-[20px] shadow-[0_-8px_40px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.08)] sm:shadow-[0_20px_60px_rgba(0,0,0,0.2)] animate-[slideUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">

        <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b bg-gradient-to-br from-blue-50 to-white">
          <div className="w-10 h-10 rounded-full bg-custom-blue  text-white font-bold flex items-center justify-center shadow-md">
            {avatar}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">
              {contact?.name || "Contact"}
            </p>
            <p className="text-xs text-gray-400">Send a quick message</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <X size={15} color="black"/>
          </button>
        </div>

        <div className="flex gap-2 px-5 pt-4">
          <button
            onClick={() => { setActiveTab("sms"); setErrors({}); }}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-semibold transition
              ${activeTab === "sms"
                ? "bg-custom-blue  text-white shadow-md"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"}
            `}
          >
            <Phone size={14} /> SMS
          </button>

          <button
            onClick={() => { setActiveTab("email"); setErrors({}); }}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-semibold transition
              ${activeTab === "email"
                ? "bg-custom-blue text-white shadow-md"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"}
            `}
          >
            <Mail size={14} /> Email
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">

          {activeTab === "sms" && (
            <>
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-400 uppercase">Phone Number</label>
                <input
                  value={smsNumber}
                  onChange={(e) => setSmsNumber(e.target.value)}
                  className={`w-full mt-1 px-3 py-2 rounded-lg bg-gray-50 border text-sm outline-none text-black focus:ring-2 focus:ring-custom-blue ${
                    errors.smsNumber ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.smsNumber && <p className="text-red-500 text-xs mt-1">{errors.smsNumber}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase">Message</label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value.slice(0, SMS_LIMIT))}
                  rows={3}
                  className={`w-full text-black mt-1 px-3 py-2 rounded-lg bg-gray-50 border text-sm outline-none focus:ring-2 focus:ring-custom-blue ${
                    errors.smsMessage ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.smsMessage && <p className="text-red-500 text-xs mt-1">{errors.smsMessage}</p>}

                <div className="text-right text-xs mt-1">
                  <span className={
                    SMS_LIMIT - smsMessage.length <= 10 ? "text-red-500" :
                    SMS_LIMIT - smsMessage.length <= 30 ? "text-yellow-500" : "text-gray-400"
                  }>
                    {smsMessage.length}/{SMS_LIMIT}
                  </span>
                </div>
              </div>
            </>
          )}

          {activeTab === "email" && (
            <>
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-400 uppercase">Email</label>
                <input
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className={`w-full text-black mt-1 px-3 py-2 rounded-lg bg-gray-50 border text-sm outline-none focus:ring-2 focus:ring-custom-blue ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase">Message</label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value.slice(0, EMAIL_LIMIT))}
                  rows={4}
                  className={`w-full text-black mt-1 px-3 py-2 rounded-lg bg-gray-50 border text-sm outline-none focus:ring-2 focus:ring-custom-blue ${
                    errors.emailMessage ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.emailMessage && <p className="text-red-500 text-xs mt-1">{errors.emailMessage}</p>}

                <div className="text-right text-xs mt-1">
                  <span className={
                    EMAIL_LIMIT - emailMessage.length <= 50 ? "text-red-500" :
                    EMAIL_LIMIT - emailMessage.length <= 150 ? "text-yellow-500" : "text-gray-400"
                  }>
                    {emailMessage.length}/{EMAIL_LIMIT}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border bg-white text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={sending}
            className="flex-1 py-2 rounded-lg text-white bg-custom-blue hover:scale-[1.02] transition flex items-center justify-center gap-2"
          >
            {sending ? "Sending..." : <> <Send size={14}/> Send </>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
