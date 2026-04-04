'use client'
import { Bell, Phone, HelpCircle, X, CheckCircle, PhoneCall, Tag,
         HeadphonesIcon, BookOpen, Video, Zap, Keyboard, Users, Smartphone, CheckCircle2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"

/* ── click-outside hook ── */
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => { if (!ref.current || ref.current.contains(e.target)) return; handler() }
    document.addEventListener("mousedown", listener)
    return () => document.removeEventListener("mousedown", listener)
  }, [ref, handler])
}

/* ── Dummy notifications ── */
const NOTIFICATIONS = [
  { id: 1, title: "New waitlist request", body: "Laura Elliott joined the waitlist for - Laser Refining (Face) .", time: "1 week ago",   clinic: "Chebo Clinic", read: false },
  { id: 2, title: "New waitlist request", body: "Laura Elliott joined the waitlist for - Laser Refining (Face) .", time: "1 week ago",   clinic: "Chebo Clinic", read: false },
  { id: 3, title: "New waitlist request", body: "Lora Zamias joined the waitlist for - Dermaflux + DermaMPT + Silhouette Plus + Six Star Peel Mini.", time: "3 weeks ago", clinic: "Chebo Clinic", read: false },
  { id: 4, title: "New waitlist request", body: "Lora Zamias joined the waitlist for - Dermaflux + DermaMPT + Silhouette Plus + Six Star Peel Mini.", time: "3 weeks ago", clinic: "Chebo Clinic", read: false },
  { id: 5, title: "New waitlist request", body: "Michael Chen joined the waitlist for - HydraFacial Deluxe.", time: "1 month ago", clinic: "Chebo Clinic", read: true },
  { id: 6, title: "Appointment confirmed", body: "Sarah Johnson confirmed her appointment for Botox Consultation.", time: "1 month ago", clinic: "Chebo Clinic", read: true },
]

export default function DashboardHeader({ title, subtitle, showIcons = true }) {
  const [openPhone, setOpenPhone]   = useState(false)
  const [openHelp, setOpenHelp]     = useState(false)
  const [openBell, setOpenBell]     = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  const phoneRef = useRef(null)
  const helpRef  = useRef(null)
  const bellRef  = useRef(null)

  useClickOutside(phoneRef, () => setOpenPhone(false))
  useClickOutside(helpRef,  () => setOpenHelp(false))
  useClickOutside(bellRef,  () => setOpenBell(false))

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const HELP_ITEMS = [
    { icon: HeadphonesIcon, label: "Contact support" },
    { icon: BookOpen,       label: "Check our help guides" },
    { icon: Video,          label: "Watch help videos" },
    { icon: Zap,            label: "Feature updates" },
    { icon: Keyboard,       label: "Keyboard shortcuts" },
    { icon: Users,          label: "Refer your friends" },
    { icon: Smartphone,     label: "Mobile apps" },
    { icon: CheckCircle2,   label: "System status", status: true },
  ]

  return (
    <div className="bg-white w-full flex items-center justify-between md:px-6 px-3 py-4 border-b border-gray-100 relative z-40">
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      {showIcons && (
        <div className="flex items-center gap-2">

          {/* ── Phone ── */}
          <div className="relative" ref={phoneRef}>
            <button onClick={() => { setOpenPhone(!openPhone); setOpenHelp(false); setOpenBell(false) }}
              className="p-2 bg-[#F1F5F9] rounded-lg shadow hover:bg-gray-200 transition">
              <Phone size={20} color="#475569" />
            </button>

            {openPhone && (
              <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-slate-800 text-base">Get help</h3>
                  <button onClick={() => setOpenPhone(false)} className="text-gray-400 hover:text-gray-600 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {[
                  { label: "Contact us",        icon: HeadphonesIcon },
                  { label: "Call us",            icon: PhoneCall },
                  { label: "Perks and discounts", icon: Tag },
                ].map((item, i, arr) => (
                  <button key={item.label}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-sm text-slate-700 hover:bg-blue-50 transition text-left ${i !== arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <item.icon className="w-4 h-4 text-slate-400 shrink-0" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Bell ── */}
          <div className="relative" ref={bellRef}>
            <button onClick={() => { setOpenBell(!openBell); setOpenPhone(false); setOpenHelp(false) }}
              className="relative p-2 bg-[#F1F5F9] rounded-lg shadow hover:bg-gray-200 transition">
              <Bell size={20} color="#475569" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {openBell && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Notifications</p>
                  <button onClick={markAllRead} className="text-xs text-custom-blue font-semibold hover:underline">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center text-sm text-slate-400">No notifications</div>
                  ) : notifications.map(n => (
                    <div key={n.id} className={`px-4 py-4 transition hover:bg-gray-50 ${!n.read ? "bg-blue-50/40" : ""}`}>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-custom-blue float-right mt-1 ml-2 shrink-0" />}
                      <p className="text-xs font-bold text-slate-800 mb-1">{n.title}</p>
                      <p className="text-sm text-slate-600 leading-relaxed mb-2">{n.body}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">{n.time}</span>
                        <span className="text-[11px] text-slate-400">{n.clinic}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Help ── */}
          <div className="relative" ref={helpRef}>
            <button onClick={() => { setOpenHelp(!openHelp); setOpenPhone(false); setOpenBell(false) }}
              className="p-2 bg-[#F1F5F9] rounded-lg shadow hover:bg-gray-200 transition">
              <HelpCircle size={20} color="#475569" />
            </button>

            {openHelp && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Help</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {HELP_ITEMS.map(item => (
                    <button key={item.label}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition text-left">
                      {item.status
                        ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        : <item.icon className="w-4 h-4 text-slate-400 shrink-0" />}
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}