import DashboardHeader from '@/components/DashboardHeader'
import React, { useState } from 'react'
import { ChevronDown, Plus, Trash2, LockKeyhole } from 'lucide-react'

function Calendersettings() {
  const [startOfWeek, setStartOfWeek] = useState('Sunday')
  const [startTime, setStartTime] = useState('9:00')
  const [timeIncrement, setTimeIncrement] = useState('5 minutes')
  const [showWeekNumbers, setShowWeekNumbers] = useState(false)
  const [showCalendarWeekends, setShowCalendarWeekends] = useState(false)
  const [initialView, setInitialView] = useState('Staff view')
  const [addCustomerNote, setAddCustomerNote] = useState(false)
  const [allowGroupBookings, setAllowGroupBookings] = useState(false)
  const [showAppointments, setShowAppointments] = useState(false)
  const [addOutlookCalendar, setAddOutlookCalendar] = useState(false)
  const [emailVerification, setEmailVerification] = useState(false)
  const [dailySummary, setDailySummary] = useState(false)
  const [inclusionField, setInclusionField] = useState(false)
  const [displayPronouns, setDisplayPronouns] = useState(false)
  const [covidVaccination, setCovidVaccination] = useState(false)
  const [initialStatus, setInitialStatus] = useState('Confirmed')
  const [addCompanyName, setAddCompanyName] = useState(false)
  const [keepPaddingTimes, setKeepPaddingTimes] = useState(false)
  const [allowDelete, setAllowDelete] = useState(false)
  const [highContrastMode, setHighContrastMode] = useState(false)
  const [displayPaddingTimes, setDisplayPaddingTimes] = useState(false)
  
  const [cancellationReasons, setCancellationReasons] = useState([
    'Other',
    'Wasn\'t due To Business/ Wasn\'t For Discount',
    'Sickness',
    'Appointment Made In Error',
    'Lorem Ipsum on This Will Refund'
  ])

  const [appointmentStatuses] = useState([
    { name: 'Not started', color: 'bg-gray-400', enabled: false },
    { name: 'Arrived', color: 'bg-purple-500', enabled: false },
    { name: 'Started', color: 'bg-gray-400', enabled: false },
    { name: 'Completed', color: 'bg-gray-400', enabled: false },
    { name: 'Did not show', color: 'bg-red-500', enabled: false }
  ])

  const handleAddReason = () => {
    setCancellationReasons([...cancellationReasons, ''])
  }

  const handleRemoveReason = (index) => {
    setCancellationReasons(cancellationReasons.filter((_, i) => i !== index))
  }

  return (
    <>
      <DashboardHeader title="Your Business" />

      <div className="min-h-screen bg-custom-gray text-slate-800 px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Calendar</h1>
            <button className="bg-custom-blue text-white px-4 sm:px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto">
              Save
            </button>
          </div>

          {/* Display settings */}
          <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-[#0A4886] border-r border-t border-b border-slate-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#0A4886]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h2 className="text-base sm:text-lg font-bold text-[#0A4886]">Display settings</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm text-slate-600 mb-2">First day of the week</label>
                  <div className="relative">
                    <select 
                      value={startOfWeek}
                      onChange={(e) => setStartOfWeek(e.target.value)}
                      className="w-full bg-slate-100 border-0 rounded-lg px-3 py-2.5 text-sm text-slate-800 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option>Sunday</option>
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-slate-600 mb-2">Calendar start time</label>
                  <div className="relative">
                    <select 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-slate-100 border-0 rounded-lg px-3 py-2.5 text-sm text-slate-800 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option>9:00</option>
                      <option>8:00</option>
                      <option>10:00</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-slate-600 mb-2">Calendar intervals</label>
                <div className="relative">
                  <select 
                    value={timeIncrement}
                    onChange={(e) => setTimeIncrement(e.target.value)}
                    className="w-full bg-slate-100 border-0 rounded-lg px-3 py-2.5 text-sm text-slate-800 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>5 minutes</option>
                    <option>10 minutes</option>
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={highContrastMode}
                    onChange={(e) => setHighContrastMode(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-slate-700">Display the calendar in high contrast mode</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={displayPaddingTimes}
                    onChange={(e) => setDisplayPaddingTimes(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-slate-700">Display appointment padding times on the calendar</span>
                </label>
              </div>
            </div>
          </div>

          {/* Appointment settings */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#0A4886]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-base sm:text-lg font-bold text-[#0A4886]">Appointment settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm text-slate-600 mb-2">Initial status for new appointments</label>
                <div className="relative">
                  <select 
                    value={initialStatus}
                    onChange={(e) => setInitialStatus(e.target.value)}
                    className="w-full bg-slate-100 border-0 rounded-lg px-3 py-2.5 text-sm text-slate-800 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Confirmed</option>
                    <option>Pending</option>
                    <option>Not started</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={addCompanyName}
                    onChange={(e) => setAddCompanyName(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-slate-700">Add company name field for customers</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={keepPaddingTimes}
                    onChange={(e) => setKeepPaddingTimes(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-slate-700">Keep padding times between appointments with multiple services</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={allowDelete}
                    onChange={(e) => setAllowDelete(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-slate-700">Allow appointments to be deleted</span>
                </label>
              </div>
            </div>
          </div>

          {/* Inclusion settings */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#0A4886]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-base sm:text-lg font-bold text-[#0A4886]">Inclusion settings</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox"
                  checked={inclusionField}
                  onChange={(e) => setInclusionField(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">Add an optional field on client and staff pages to capture pronouns</p>
                  <p className="text-xs text-slate-500 mt-1">Helps create a more welcoming environment for everyone.</p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={displayPronouns}
                  onChange={(e) => setDisplayPronouns(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs sm:text-sm text-slate-700">Display client pronouns on calendar</span>
              </label>
            </div>
          </div>

          {/* Covid vaccination policy */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#0A4886]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h2 className="text-base sm:text-lg font-bold text-[#0A4886]">Covid vaccination policy</h2>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={covidVaccination}
                  onChange={(e) => setCovidVaccination(e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer ${covidVaccination ? 'bg-blue-600' : 'bg-gray-300'} peer-focus:ring-2 peer-focus:ring-blue-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${covidVaccination ? 'after:translate-x-full' : ''}`}></div>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium mb-2">Covid-19 vaccination requirements</p>
                <p className="text-xs text-slate-500">Enabling this option adds a checkbox to the bottom of each online booking. When checked, the client confirms that they meet the business COVID vaccination policy. This must be checked to complete the booking.</p>
              </div>
            </div>
          </div>

          {/* Invitation settings - REMOVED as it's not in the image */}

          {/* Email verification policy - REMOVED as it's not in the image */}

          {/* Daily appointment summary */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#0A4886]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-base sm:text-lg font-bold text-[#0A4886]">Daily appointment summary</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox"
                  checked={dailySummary}
                  onChange={(e) => setDailySummary(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">Receive an email summary of all appointments for the day</p>
                  <p className="text-xs text-slate-500 mt-1">This summary will be sent to the account holder's email address at 6:00 AM every day.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation reasons */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#0A4886]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h2 className="text-base sm:text-lg font-bold text-[#0A4886]">Cancellation reasons</h2>
              </div>
              <button 
                onClick={handleAddReason}
                className="text-[#0A4886] text-xs sm:text-sm font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add reason
              </button>
            </div>

            <div className="space-y-2">
              {cancellationReasons.map((reason, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input 
                    type="text"
                    value={reason}
                    onChange={(e) => {
                      const newReasons = [...cancellationReasons]
                      newReasons[index] = e.target.value
                      setCancellationReasons(newReasons)
                    }}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter reason"
                  />
                  <button 
                    onClick={() => handleRemoveReason(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Status */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#0A4886]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h2 className="text-base sm:text-lg font-bold text-[#0A4886]">Appointment Status</h2>
              </div>
              <button className="w-8 h-8 rounded-full bg-[#0A4886] text-white flex items-center justify-center hover:bg-[#083a6b] transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {appointmentStatuses.map((status, index) => (
                <div key={index} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                    <span className="text-xs sm:text-sm text-slate-700">{status.name}</span>
                  </div>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                    <LockKeyhole className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pb-6">
            <button className="bg-custom-blue text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto">
              Save
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default Calendersettings