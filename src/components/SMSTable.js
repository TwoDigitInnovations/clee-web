import React from "react";
import { MessageSquare, Calendar } from "lucide-react";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-blue-200 text-blue-700",
  "bg-purple-200 text-purple-700",
  "bg-green-200 text-green-700",
  "bg-rose-200 text-rose-700",
  "bg-amber-200 text-amber-700",
];

function getAvatarColor(name = "") {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function SMSTable({
  messages,
  onReply,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  actiontrue,
}) {
  const allSelected =
    messages.length > 0 && selectedIds.length === messages.length;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      {/* ✅ Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-white">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  className="rounded border-slate-300 text-custom-blue"
                />
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-slate-500">
                Via
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
                Date/Time
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
                Customer
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
                Booking
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
                {actiontrue ? 'Received' : 'Sent to'}
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
                Message
              </th>
              {actiontrue && (
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(msg.id)}
                    onChange={() => onToggleSelect(msg.id)}
                  />
                </td>

                <td className="px-2 py-3">
                  <MessageSquare size={16} className="text-slate-400" />
                </td>

                <td className="px-3 py-3 text-xs">
                  <div>{msg.date}</div>
                  <div>{msg.time}</div>
                </td>

                <td className="px-3 py-3">{msg.customerName}</td>

                <td className="px-3 py-3">{msg.bookingId ? "View" : "—"}</td>

                <td className="px-3 py-3 text-xs">{actiontrue ? msg.receivedFrom :  msg.sendto}</td>

                <td className="px-3 py-3 text-xs max-w-xs line-clamp-2">
                  {msg.message}
                </td>
                {actiontrue && (
                  <td className="px-3 py-3">
                    <button
                      onClick={() => onReply(msg)}
                      className="px-3 py-1 bg-custom-blue text-white rounded text-xs"
                    >
                      Reply
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden divide-y">
        {messages.map((msg) => (
          <div key={msg.id} className="p-4 space-y-2">
            {/* Top Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(msg.id)}
                  onChange={() => onToggleSelect(msg.id)}
                />
                <MessageSquare size={16} className="text-slate-400" />
                <span className="text-sm font-medium">{msg.customerName}</span>
              </div>
              {actiontrue && (
                <button
                  onClick={() => onReply(msg)}
                  className="px-3 py-1 bg-custom-blue text-white rounded text-xs"
                >
                  Reply
                </button>
              )}
            </div>

            {/* Date */}
            <div className="text-xs text-slate-500">
              {msg.date} • {msg.time}
            </div>

            {/* Message */}
            <div className="text-sm text-slate-600 line-clamp-2">
              {msg.message}
            </div>

            {/* Bottom Info */}
            <div className="flex justify-between text-xs text-slate-400">
              <span>{actiontrue ? msg.receivedFrom :  msg.sendto}</span>
              <span>{msg.bookingId ? "Booking Available" : "No Booking"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SMSTable;
