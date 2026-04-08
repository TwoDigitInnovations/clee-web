import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { fetchSettings, updateStaffSettings } from '../../redux/actions/notificationActions';

const StaffNotification = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.notification);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointmentEmail, setAppointmentEmail] = useState(true);
  const [appointmentSMS, setAppointmentSMS] = useState(false);
  const [onlineEmail, setOnlineEmail] = useState(true);
  const [onlineSMS, setOnlineSMS] = useState(false);
  const [staffMemberEmail, setStaffMemberEmail] = useState(true);
  const [staffMemberSMS, setStaffMemberSMS] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [countryCode, setCountryCode] = useState('+61');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const result = await dispatch(fetchSettings(router));
      if (result.success && result.data.staffNotifications) {
        const staffSettings = result.data.staffNotifications;
        setAppointmentEmail(staffSettings.appointmentEmail);
        setAppointmentSMS(staffSettings.appointmentSMS);
        setOnlineEmail(staffSettings.onlineEmail);
        setOnlineSMS(staffSettings.onlineSMS);
        setStaffMemberEmail(staffSettings.staffMemberEmail);
        setStaffMemberSMS(staffSettings.staffMemberSMS);
        setEmailAddress(staffSettings.emailAddress);
        setCountryCode(staffSettings.countryCode);
        setPhoneNumber(staffSettings.phoneNumber);
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
      const result = await dispatch(updateStaffSettings({
        appointmentEmail,
        appointmentSMS,
        onlineEmail,
        onlineSMS,
        staffMemberEmail,
        staffMemberSMS,
        emailAddress,
        countryCode,
        phoneNumber
      }, router));
      
      if (result.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Settings saved successfully!',
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
        <h1 className="text-2xl md:text-3xl font-semibold text-[#0a4d91]">Staff Notifications</h1>
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
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Appointment changes</h2>
          <p className="text-sm text-gray-600 mb-6">
            Choose how your staff are notified when changes are made to an appointment.
          </p>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={appointmentEmail}
                onChange={(e) => setAppointmentEmail(e.target.checked)}
                className="w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
              />
              <span className="text-sm text-gray-700">Send the staff person booked an email notification</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={appointmentSMS}
                onChange={(e) => setAppointmentSMS(e.target.checked)}
                className="w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
              />
              <span className="text-sm text-gray-700">Send the staff person booked an SMS notification</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Online bookings</h2>
          <p className="text-sm text-gray-600 mb-6">
            Choose how and who gets notified when a customer makes an online booking.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={onlineEmail}
                  onChange={(e) => setOnlineEmail(e.target.checked)}
                  className="w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                />
                <span className="text-sm text-gray-700 font-medium">Send an email notification to</span>
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                disabled={!onlineEmail}
                className="w-full px-4 py-2.5 text-gray-700 border-0 border-b-2 border-[#0A4D91] text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-[#0A4D91] disabled:opacity-50 rounded-none"
                placeholder="Email address"
              />
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={onlineSMS}
                  onChange={(e) => setOnlineSMS(e.target.checked)}
                  className="w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                />
                <span className="text-sm text-gray-700 font-medium">Send an SMS notification to</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled={!onlineSMS}
                  className="w-20 px-3 text-gray-700 py-2.5 border-0 border-b-2 border-[#0A4D91] text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-[#0A4D91] disabled:opacity-50 rounded-none"
                  placeholder="+61"
                />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!onlineSMS}
                  className="flex-1 px-4 py-2.5 border-0 text-gray-700 border-b-2 border-[#0A4D91] text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-[#0A4D91] disabled:opacity-50 rounded-none"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">...AND/OR NOTIFY THE STAFF MEMBER BOOKED</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={staffMemberEmail}
                  onChange={(e) => setStaffMemberEmail(e.target.checked)}
                  className="w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                />
                <span className="text-sm text-gray-700">Send an email notification to the staff member booked</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={staffMemberSMS}
                  onChange={(e) => setStaffMemberSMS(e.target.checked)}
                  className="w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                />
                <span className="text-sm text-gray-700">Send an SMS notification to the staff member booked</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 rounded-lg text-sm font-medium bg-[#0A4D91] text-white transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffNotification;
