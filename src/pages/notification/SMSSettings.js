import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Info, Clock, MessageSquare, Smartphone } from 'lucide-react';
import Swal from 'sweetalert2';
import { fetchSettings, updateSMSSettings } from '../../redux/actions/notificationActions';

const SMSSettings = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [twoWaySMS, setTwoWaySMS] = useState(true);
  const [confirmPencilled, setConfirmPencilled] = useState(true);
  const [makePencilledDefault, setMakePencilledDefault] = useState(false);
  const [sendConfirmationSMS, setSendConfirmationSMS] = useState(true);
  const [startTime, setStartTime] = useState('09:00 AM');
  const [stopTime, setStopTime] = useState('09:00 PM');
  const [notificationDelay, setNotificationDelay] = useState('Default (10 minutes)');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const result = await dispatch(fetchSettings(router));
      if (result.success && result.data.smsSettings) {
        const smsSettings = result.data.smsSettings;
        setTwoWaySMS(smsSettings.twoWaySMS);
        setConfirmPencilled(smsSettings.confirmPencilled);
        setMakePencilledDefault(smsSettings.makePencilledDefault);
        setSendConfirmationSMS(smsSettings.sendConfirmationSMS);
        setStartTime(smsSettings.startTime);
        setStopTime(smsSettings.stopTime);
        setNotificationDelay(smsSettings.notificationDelay);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await dispatch(updateSMSSettings({
        twoWaySMS,
        confirmPencilled,
        makePencilledDefault,
        sendConfirmationSMS,
        startTime,
        stopTime,
        notificationDelay
      }, router));
      
      if (result.success) {
        Swal.fire({
          title: 'Success!',
          text: 'SMS settings saved successfully!',
          icon: 'success',
          confirmButtonColor: '#0A4D91'
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save settings',
        icon: 'error',
        confirmButtonColor: '#0A4D91'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 bg-custom-gray min-h-screen flex items-center justify-center">
        <div className="text-[#0a4d91]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-custom-gray min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#0a4d91]">SMS Settings</h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#0A4D91] text-white transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">SMS settings</h2>
          <p className="text-sm text-gray-600 mb-6">
            Configure how your salon communicates with clients through automated and two-way messaging.
          </p>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Two-way SMS</h3>
                <p className="text-sm text-gray-600">Engage with clients directly through text messaging.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoWaySMS}
                  onChange={(e) => setTwoWaySMS(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A4D91]"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">Allow customers to reply to SMS messages</p>
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Two-way SMS requires either <span className="font-semibold">Follow-up</span> or <span className="font-semibold">Rebooking reminder</span> settings to be enabled. Without these automated triggers, customers will not have a thread to initiate a reply.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Two-way Confirmation</h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmPencilled}
                  onChange={(e) => setConfirmPencilled(e.target.checked)}
                  className="mt-0.5 w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    Allow customers to confirm pencilled-in appointments
                  </div>
                  <div className="text-sm text-gray-600">
                    Customers can text "YES" to confirm their booking.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={makePencilledDefault}
                  onChange={(e) => setMakePencilledDefault(e.target.checked)}
                  className="mt-0.5 w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    Make pencilled-in the default status
                  </div>
                  <div className="text-sm text-gray-600">
                    New bookings will start as pencilled-in until confirmed via SMS.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendConfirmationSMS}
                  onChange={(e) => setSendConfirmationSMS(e.target.checked)}
                  className="mt-0.5 w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    Send a confirmation SMS when customers use two-way confirmation
                  </div>
                  <div className="text-sm text-gray-600">
                    Auto-reply acknowledging their confirmation.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Smartphone size={24} color="#0a4d91" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-800 mb-2">Dedicated SMS Number</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Communicate with your customers from a unique, professional number that stays consistent for every message sent.
                </p>
                <button className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#0A4D91] text-white transition-colors">
                  Get your Dedicated SMS Number now →
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-gray-600" />
                <h3 className="text-base font-semibold text-gray-800">SMS time restrictions</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    START SENDING MESSAGES AT
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 text-gray-700 focus:ring-[#0a4d91] focus:border-transparent"
                  >
                    <option>09:00 AM</option>
                    <option>08:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    STOP SENDING MESSAGES AT
                  </label>
                  <select
                    value={stopTime}
                    onChange={(e) => setStopTime(e.target.value)}
                    className="w-full text-gray-700 px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0a4d91] focus:border-transparent"
                  >
                    <option>09:00 PM</option>
                    <option>08:00 PM</option>
                    <option>10:00 PM</option>
                    <option>11:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={20} className="text-gray-600" />
                <h3 className="text-base font-semibold text-gray-800">SMS and email delay</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Avoid sending notifications immediately to allow time for staff to adjust booking details if needed.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NOTIFICATION DELAY
                </label>
                <select
                  value={notificationDelay}
                  onChange={(e) => setNotificationDelay(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none text-gray-700 focus:ring-2 focus:ring-[#0a4d91] focus:border-transparent"
                >
                  <option>Default (10 minutes)</option>
                  <option>5 minutes</option>
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-lg text-sm font-medium bg-[#0A4D91] text-white transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Change'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMSSettings;
