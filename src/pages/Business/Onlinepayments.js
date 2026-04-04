'use client'
import DashboardHeader from '@/components/DashboardHeader'
import React, { useState } from 'react'
import {
  DollarSign,
  CreditCard,
  ShieldCheck,
  RotateCcw,
  Ban,
  Eye,
  EyeOff,
  ChevronDown,
  AlertCircle,
  CheckSquare,
  Square,
  History,
  Scale,
  Info,
  Clock,
  Percent,
  FileText,
  Save,
} from 'lucide-react'

/* ─── reusable atoms ─── */
function SectionCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${className}`}>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-custom-blue' : 'bg-gray-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function Checkbox({ checked, onChange, label }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center gap-2 text-left group">
      {checked ? (
        <CheckSquare className="w-4 h-4 text-custom-blue shrink-0" />
      ) : (
        <Square className="w-4 h-4 text-gray-300 shrink-0" />
      )}
      <span className="text-sm text-slate-700 leading-snug">{label}</span>
    </button>
  )
}

function SectionLabel({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-custom-blue" />
      </div>
      <div>
        <p className="font-semibold text-slate-800 text-sm">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

export default function Onlinepayments() {
  const [depositAmount, setDepositAmount] = useState('89.00')
  const [payLater, setPayLater] = useState(true)
  const [cardCapture, setCardCapture] = useState(true)
  const [allowChanges, setAllowChanges] = useState(true)
  const [includeLink, setIncludeLink] = useState(true)
  const [hideDefault, setHideDefault] = useState(false)
  const [customTerms, setCustomTerms] = useState(
    'Our organization reserves the right to review refund requests on a case-by-case basis during seasonal peak periods. Emergency cancellations verified with medical documentation may be eligible for full service credit regardless of the 24-hour window.'
  )
  const [cancellationWindow, setCancellationWindow] = useState('Up to 1 week before their appointment')
  const maxTerms = 2069

  return (
    <>
      <DashboardHeader title="Your Business" />

      <div className="min-h-screen bg-[#f0f1f5] text-custom-blue px-4 md:px-6 py-4">

        {/* Top save */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-custom-blue">Online Payment</h1>
          <button className="flex items-center gap-2 bg-custom-blue text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

         
          <div className="lg:col-span-2 space-y-4">

            
            <SectionCard>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-custom-blue" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Payment Terms</p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* Deposit Amount */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Deposit Amount</p>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-custom-blue transition">
                    <span className="px-3 py-2.5 bg-gray-50 text-slate-500 text-sm border-r border-gray-200">$</span>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="flex-1 px-3 py-2.5 text-sm text-slate-800 outline-none bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Requires deposit per online booking.</p>
                </div>

                {/* Payment Method */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Payment Method</p>
                  <div className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2.5 bg-white">
                    <span className="text-sm text-slate-700">Pay later option</span>
                    <Toggle checked={payLater} onChange={setPayLater} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Allow customers to pay at the venue.</p>
                </div>
              </div>
            </SectionCard>

          
            <SectionCard>
              <div className="flex items-start justify-between gap-4">
                <SectionLabel
                  icon={CreditCard}
                  title="Card Capture Activation"
                  subtitle="Secure card details for no-show protection."
                />
                <div className="shrink-0 mt-1">
                  {cardCapture ? (
                    <CheckSquare className="w-5 h-5 text-custom-blue cursor-pointer" onClick={() => setCardCapture(false)} />
                  ) : (
                    <Square className="w-5 h-5 text-gray-300 cursor-pointer" onClick={() => setCardCapture(true)} />
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-1">
                <p className="text-sm text-slate-600 leading-relaxed">
                  When enabled, customers must provide credit card details to confirm a booking. No immediate charge is made, but funds can be authorised according to your cancellation policy.
                </p>
              </div>
            </SectionCard>

            {/* Changes Policy */}
            <SectionCard>
              <SectionLabel
                icon={RotateCcw}
                title="Changes policy"
                subtitle="Choose when online bookings can be cancelled or changed."
              />
              <div className="space-y-3 mb-5">
                <Checkbox
                  checked={allowChanges}
                  onChange={setAllowChanges}
                  label="Allow online booking changes and include a link in emails for clients to change their booking"
                />
                <Checkbox
                  checked={includeLink}
                  onChange={setIncludeLink}
                  label="Include a link in emails for clients to change their booking"
                />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Set when appointments can be changed or cancelled:
              </p>
              <div className="relative">
                <select
                  value={cancellationWindow}
                  onChange={(e) => setCancellationWindow(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 pr-10 focus:outline-none focus:border-custom-blue"
                >
                  <option>Up to 1 week before their appointment</option>
                  <option>Up to 48 hours before their appointment</option>
                  <option>Up to 24 hours before their appointment</option>
                  <option>Up to 2 hours before their appointment</option>
                  <option>Anytime</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </SectionCard>

            {/* Cancellation Terms */}
            <SectionCard>
              <SectionLabel
                icon={Ban}
                title="Cancellation terms"
                subtitle="Let customers know your cancellation policy when making an online booking."
              />

              {/* Preview Box */}
              <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-custom-blue mb-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> This is what your customers will see
                </p>
                <div className="border-l-4 border-custom-blue pl-3">
                  <p className="font-semibold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-custom-blue" /> Cancellation policy
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Bookings cancelled within 24 hours of the service date will be non-refundable. Cancellations made more than 24 hours in advance will receive a full refund minus a 5% processing fee.
                  </p>
                  <p className="text-xs text-slate-400 mt-2 italic">
                    Note: Some service providers may have specific override terms which will be displayed during the checkout process if applicable.
                  </p>
                </div>
              </div>

              {/* Hide Default */}
              <Checkbox
                checked={hideDefault}
                onChange={setHideDefault}
                label="Hide default cancellation policy — Check this if you only want to show your custom terms and hide the platform-wide standard text."
              />

              {/* Custom Terms */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Custom Cancellation Terms</p>
                  <span className="text-[11px] text-slate-400">{customTerms.length} / {maxTerms}</span>
                </div>
                <p className="text-xs text-slate-400 mb-2">Add specific legal requirements or promotional refund terms here.</p>
                <textarea
                  rows={5}
                  value={customTerms}
                  onChange={(e) => setCustomTerms(e.target.value.slice(0, maxTerms))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:border-custom-blue resize-none leading-relaxed"
                />
              </div>
            </SectionCard>

            {/* Bottom cards row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Policy Audit Logs */}
              <div className="bg-custom-blue rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <History className="w-5 h-5 opacity-80" />
                  <p className="font-bold text-sm">Policy Audit Logs</p>
                </div>
                <p className="text-xs opacity-70 leading-relaxed mb-4">
                  Track changes made to this cancellation policy. Audit ensures transparency for your legal and support teams.
                </p>
                <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition text-white text-xs font-semibold px-4 py-2 rounded-lg">
                  <History className="w-3.5 h-3.5" /> View Change History
                </button>
              </div>

              {/* Legal Compliance */}
              <div className="bg-[#EC5B13] rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="w-5 h-5 opacity-80" />
                  <p className="font-bold text-sm">Legal Compliance</p>
                </div>
                <p className="text-xs opacity-80 leading-relaxed">
                  Ensure your terms comply with local consumer protection laws regarding digital service refunds.
                </p>
              </div>
            </div>

            {/* Bottom Save */}
            <div className="flex justify-end pb-2">
              <button className="flex items-center gap-2 bg-custom-blue text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>

      
          <div className="space-y-4">
            <div className="bg-custom-blue rounded-2xl p-5 text-white sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 opacity-80" />
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Cancellation Fees Policy</p>
              </div>

              {/* Late Cancellation */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Late Cancellation</p>
                <p className="text-3xl font-extrabold tracking-tight">$45.00</p>
                <p className="text-xs opacity-60 mt-0.5">If cancelled less than 24 hours before.</p>
              </div>

              <div className="w-full h-px bg-white/20 mb-4" />

              {/* No-Show Fee */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">No-Show Fee</p>
                <p className="text-4xl font-extrabold tracking-tight">100%</p>
                <p className="text-xs opacity-60 mt-0.5">Full service value will be charged.</p>
              </div>

              <div className="w-full h-px bg-white/20 mb-4" />

              {/* Anytime Compliance */}
              <div className="bg-white/10 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckSquare className="w-3.5 h-3.5 opacity-80" />
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Anytime Compliance</p>
                </div>
                <p className="text-xs opacity-70 leading-relaxed">
                  All fees are processed through Stripe and adhere to Stripe's merchant service agreements.
                </p>
              </div>

              <button className="w-full bg-white text-custom-blue text-sm font-bold py-2.5 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2">
                Edit Policy Details <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}