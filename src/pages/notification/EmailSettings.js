import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { HelpCircle, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import { fetchSettings, updateEmailSettings } from '../../redux/actions/notificationActions';

const EmailSettings = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [additionalText, setAdditionalText] = useState('');
  const [attachCalendar, setAttachCalendar] = useState(true);
  const [hideDetails, setHideDetails] = useState(false);
  const [bccEmail, setBccEmail] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [receiveCustomerCopy, setReceiveCustomerCopy] = useState(false);
  const [receiveStaffCopy, setReceiveStaffCopy] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const result = await dispatch(fetchSettings(router));
      if (result.success && result.data.emailSettings) {
        const emailSettings = result.data.emailSettings;
        setAdditionalText(emailSettings.additionalText);
        setAttachCalendar(emailSettings.attachCalendar);
        setHideDetails(emailSettings.hideDetails);
        setBccEmail(emailSettings.bccEmail);
        setReplyEmail(emailSettings.replyEmail);
        setReceiveCustomerCopy(emailSettings.receiveCustomerCopy);
        setReceiveStaffCopy(emailSettings.receiveStaffCopy);
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
      const result = await dispatch(updateEmailSettings({
        additionalText,
        attachCalendar,
        hideDetails,
        bccEmail,
        replyEmail,
        receiveCustomerCopy,
        receiveStaffCopy
      }, router));
      
      if (result.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Email settings saved successfully!',
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
        <h1 className="text-2xl md:text-3xl font-semibold text-[#0a4d91]">Email Settings</h1>
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
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Email Settings</h2>
          <p className="text-sm text-gray-600 mb-6">
            Configure how Lumiere communicates with your clients and staff.
          </p>

          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Additional Text</h3>
            <p className="text-sm text-gray-600 mb-4">
              This text appears at the bottom of all appointment confirmations and reminders sent to customers.
            </p>
            <textarea
              value={additionalText}
              onChange={(e) => setAdditionalText(e.target.value)}
              rows={6}
              className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0a4d91] focus:border-transparent resize-none"
              placeholder="Enter additional text..."
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-base font-semibold text-gray-800">Email Extras</h3>
              <HelpCircle size={16} className="text-gray-400" />
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={attachCalendar}
                  onChange={(e) => setAttachCalendar(e.target.checked)}
                  className="mt-0.5 w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    Attach calendar files (.ics) to customer emails
                  </div>
                  <div className="text-sm text-gray-600">
                    Allows clients to easily add appointments to Google, Apple, or Outlook calendars.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={hideDetails}
                  onChange={(e) => setHideDetails(e.target.checked)}
                  className="mt-0.5 w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    Hide service and staff details on email notifications
                  </div>
                  <div className="text-sm text-gray-600">
                    Keep internal details confidential for private booking types.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">BCC Email Address</h3>
              <p className="text-sm text-gray-600 mb-4">
                Receive copies of outgoing communications.
              </p>
              <input
                type="email"
                value={bccEmail}
                onChange={(e) => setBccEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-gray-700 border-0 border-b-2 border-[#0A4D91] text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-[#0A4D91] rounded-none mb-4"
                placeholder="Email address"
              />
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={receiveCustomerCopy}
                    onChange={(e) => setReceiveCustomerCopy(e.target.checked)}
                    className="w-4 h-4 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                  />
                  <span className="text-sm text-gray-700">Receive a copy of emails sent to customers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={receiveStaffCopy}
                    onChange={(e) => setReceiveStaffCopy(e.target.checked)}
                    className="w-4 h-4 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                  />
                  <span className="text-sm text-gray-700">Receive a copy of emails sent to staff</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Email for Replies</h3>
              <p className="text-sm text-gray-600 mb-4">
                The address where customer replies will be sent.
              </p>
              <input
                type="email"
                value={replyEmail}
                onChange={(e) => setReplyEmail(e.target.value)}
                className="w-full text-gray-700 px-4 py-2.5 border-0 border-b-2 border-[#0A4D91] text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-[#0A4D91] rounded-none mb-4"
                placeholder="Email address"
              />
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  This is the reply-to address used for automated emails. Ensure this inbox is monitored frequently to handle client inquiries promptly.
                </p>
              </div>
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

export default EmailSettings;
