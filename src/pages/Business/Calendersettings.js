import DashboardHeader from '@/components/DashboardHeader'
import React, { useState, useEffect } from 'react'
import { ChevronDown, Plus, Trash2, LockKeyhole } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import {
  getCalendarSettings,
  updateCalendarSettings,
} from '@/redux/actions/calendarSettingsActions'

function Calendersettings() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { settings, loading } = useSelector((state) => state.calendarSettings)

 
  const [formData, setFormData] = useState({
    displaySettings: {
      startOfWeek: 'Sunday',
      calendarStartTime: '9:00',
      timeIncrement: '5 minutes',
      highContrastMode: false,
      displayPaddingTimes: false,
    },
    appointmentSettings: {
      initialStatus: 'Confirmed',
      addCompanyName: false,
      keepPaddingTimes: false,
      allowDelete: false,
    },
    inclusionSettings: {
      capturePronouns: false,
      displayPronouns: false,
    },
    covidVaccinationPolicy: {
      enabled: false,
    },
    dailySummary: {
      enabled: false,
    },
    cancellationReasons: [
      'Other',
      "Wasn't due To Business/ Wasn't For Discount",
      'Sickness',
      'Appointment Made In Error',
      'Lorem Ipsum on This Will Refund',
    ],
    appointmentStatuses: [
      { name: 'Not started', color: 'bg-gray-400', enabled: false },
      { name: 'Arrived', color: 'bg-purple-500', enabled: false },
      { name: 'Started', color: 'bg-gray-400', enabled: false },
      { name: 'Completed', color: 'bg-gray-400', enabled: false },
      { name: 'Did not show', color: 'bg-red-500', enabled: false },
    ],
  })


  useEffect(() => {
    dispatch(getCalendarSettings())
  }, [dispatch])

  
  useEffect(() => {
    if (settings) {
      setFormData({
        displaySettings: settings.displaySettings || formData.displaySettings,
        appointmentSettings: settings.appointmentSettings || formData.appointmentSettings,
        inclusionSettings: settings.inclusionSettings || formData.inclusionSettings,
        covidVaccinationPolicy: settings.covidVaccinationPolicy || formData.covidVaccinationPolicy,
        dailySummary: settings.dailySummary || formData.dailySummary,
        cancellationReasons: settings.cancellationReasons || formData.cancellationReasons,
        appointmentStatuses: settings.appointmentStatuses || formData.appointmentStatuses,
      })
    }
  }, [settings])

  const handleSave = async () => {
    try {
      await dispatch(updateCalendarSettings(formData)).unwrap()
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Calendar settings saved successfully',
        confirmButtonColor: '#0A4886',
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save settings. Please try again.',
        confirmButtonColor: '#0A4886',
      })
    }
  }

  const handleAddReason = () => {
    setFormData({
      ...formData,
      cancellationReasons: [...formData.cancellationReasons, ''],
    })
  }

  const handleRemoveReason = (index) => {
    const newReasons = formData.cancellationReasons.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      cancellationReasons: newReasons,
    })
  }

  const handleReasonChange = (index, value) => {
    const newReasons = [...formData.cancellationReasons]
    newReasons[index] = value
    setFormData({
      ...formData,
      cancellationReasons: newReasons,
    })
  }

  const handleAddStatus = () => {
    const newStatus = {
      name: 'New Status',
      color: 'bg-blue-500',
      enabled: false,
    }
    setFormData({
      ...formData,
      appointmentStatuses: [...formData.appointmentStatuses, newStatus],
    })
  }

  const handleRemoveStatus = (index) => {
    const newStatuses = formData.appointmentStatuses.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      appointmentStatuses: newStatuses,
    })
  }

  const handleStatusChange = (index, field, value) => {
    const newStatuses = [...formData.appointmentStatuses]
    newStatuses[index][field] = value
    setFormData({
      ...formData,
      appointmentStatuses: newStatuses,
    })
  }

  return (
    <>
      <DashboardHeader title="Your Business" />

      <div className="min-h-screen bg-custom-gray text-slate-800 px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Calendar</h1>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="bg-custom-blue text-white px-4 sm:px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>

       
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
                      value={formData.displaySettings.startOfWeek}
                      onChange={(e) => setFormData({
                        ...formData,
                        displaySettings: { ...formData.displaySettings, startOfWeek: e.target.value }
                      })}
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
                      value={formData.displaySettings.calendarStartTime}
                      onChange={(e) => setFormData({
                        ...formData,
                        displaySettings: { ...formData.displaySettings, calendarStartTime: e.target.value }
                      })}
                      className="w-full bg-slate-100 border-0 rounded-lg px-3 py-2.5 text-sm text-slate-800 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option>9:00</option>
                      <option>8:00</option>
                      <option>10:00</option>
                      <option>11:00</option>
                      <option>12:00</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-slate-600 mb-2">Calendar intervals</label>
                <div className="relative">
                  <select 
                    value={formData.displaySettings.timeIncrement}
                    onChange={(e) => setFormData({
                      ...formData,
                      displaySettings: { ...formData.displaySettings, timeIncrement: e.target.value }
                    })}
                    className="w-full bg-slate-100 border-0 rounded-lg px-3 py-2.5 text-sm text-slate-800 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>5 minutes</option>
                    <option>10 minutes</option>
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>60 minutes</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.displaySettings.highContrastMode}
                    onChange={(e) => setFormData({
                      ...formData,
                      displaySettings: { ...formData.displaySettings, highContrastMode: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-slate-700">Display the calendar in high contrast mode</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.displaySettings.displayPaddingTimes}
                    onChange={(e) => setFormData({
                      ...formData,
                      displaySettings: { ...formData.displaySettings, displayPaddingTimes: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-slate-700">Display appointment padding times on the calendar</span>
                </label>
              </div>
            </div>
          </div>

        
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
                    value={formData.appointmentSettings.initialStatus}
                    onChange={(e) => setFormData({
                      ...formData,
                      appointmentSettings: { ...formData.appointmentSettings, initialStatus: e.target.value }
                    })}
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
                    checked={formData.appointmentSettings.addCompanyName}
                    onChange={(e) => setFormData({
                      ...formData,
                      appointmentSettings: { ...formData.appointmentSettings, addCompanyName: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-slate-700">Add company name field for customers</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.appointmentSettings.keepPaddingTimes}
                    onChange={(e) => setFormData({
                      ...formData,
                      appointmentSettings: { ...formData.appointmentSettings, keepPaddingTimes: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-slate-700">Keep padding times between appointments with multiple services</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.appointmentSettings.allowDelete}
                    onChange={(e) => setFormData({
                      ...formData,
                      appointmentSettings: { ...formData.appointmentSettings, allowDelete: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-slate-700">Allow appointments to be deleted</span>
                </label>
              </div>
            </div>
          </div>

      
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
                  checked={formData.inclusionSettings.capturePronouns}
                  onChange={(e) => setFormData({
                    ...formData,
                    inclusionSettings: { ...formData.inclusionSettings, capturePronouns: e.target.checked }
                  })}
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
                  checked={formData.inclusionSettings.displayPronouns}
                  onChange={(e) => setFormData({
                    ...formData,
                    inclusionSettings: { ...formData.inclusionSettings, displayPronouns: e.target.checked }
                  })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs sm:text-sm text-slate-700">Display client pronouns on calendar</span>
              </label>
            </div>
          </div>

        
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
                  checked={formData.covidVaccinationPolicy.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    covidVaccinationPolicy: { enabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer ${formData.covidVaccinationPolicy.enabled ? 'bg-blue-600' : 'bg-gray-300'} peer-focus:ring-2 peer-focus:ring-blue-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${formData.covidVaccinationPolicy.enabled ? 'after:translate-x-full' : ''}`}></div>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium mb-2">Covid-19 vaccination requirements</p>
                <p className="text-xs text-slate-500">Enabling this option adds a checkbox to the bottom of each online booking. When checked, the client confirms that they meet the business COVID vaccination policy. This must be checked to complete the booking.</p>
              </div>
            </div>
          </div>

         

         
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
                  checked={formData.dailySummary.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    dailySummary: { enabled: e.target.checked }
                  })}
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
              {formData.cancellationReasons.map((reason, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input 
                    type="text"
                    value={reason}
                    onChange={(e) => handleReasonChange(index, e.target.value)}
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
              <button 
                onClick={handleAddStatus}
                className="w-8 h-8 rounded-full bg-[#0A4886] text-white flex items-center justify-center hover:bg-[#083a6b] transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {formData.appointmentStatuses.map((status, index) => (
                <div key={index} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                    <input
                      type="text"
                      value={status.name}
                      onChange={(e) => handleStatusChange(index, 'name', e.target.value)}
                      className="flex-1 bg-transparent text-xs sm:text-sm text-slate-700 border-0 outline-none focus:bg-slate-50 px-2 py-1 rounded"
                      placeholder="Status name"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleRemoveStatus(index)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Delete status"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                      <LockKeyhole className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pb-6">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="bg-custom-blue text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default Calendersettings