import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { HelpCircle, Lightbulb, MessageSquare, Mail, X, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import { getTemplateById, createTemplate, updateTemplate } from '../../redux/actions/notificationActions';

const AddMessage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { edit } = router.query;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [showWarning, setShowWarning] = useState(true);
  const [timing, setTiming] = useState('24 hours after');
  const [appointmentStatus, setAppointmentStatus] = useState('Not started');
  const [serviceType, setServiceType] = useState('any');
  const [sendWithStatus, setSendWithStatus] = useState(true);
  const [sendNoPrevious, setSendNoPrevious] = useState(false);
  const [sendOnlyOnce, setSendOnlyOnce] = useState(false);
  const [messageName, setMessageName] = useState('');
  const [messageText, setMessageText] = useState('Thanks for visiting us at BUSINESS_NAME! We hope you enjoyed our services. Have a great day!');
  const [showCostInfo, setShowCostInfo] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [futureAppointmentType, setFutureAppointmentType] = useState('any');
  const [selectedFutureServices, setSelectedFutureServices] = useState([]);
  const [showFutureServiceModal, setShowFutureServiceModal] = useState(false);

  useEffect(() => {
    if (edit) {
      fetchTemplate();
    }
  }, [edit]);

  const fetchTemplate = async () => {
    setLoading(true);
    try {
      const result = await dispatch(getTemplateById(edit, router));
      if (result.success) {
        const template = result.data;
        setMessageName(template.name);
        setSelectedType(template.type);
        setSelectedChannel(template.channel);
        setTiming(template.timing);
        setAppointmentStatus(template.appointmentStatus);
        setServiceType(template.serviceType);
        setSelectedServices(template.selectedServices || []);
        setFutureAppointmentType(template.futureAppointmentType);
        setSelectedFutureServices(template.selectedFutureServices || []);
        setSendWithStatus(template.sendWithStatus);
        setSendNoPrevious(template.sendNoPrevious);
        setSendOnlyOnce(template.sendOnlyOnce);
        setMessageText(template.messageText);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load template',
        icon: 'error',
        confirmButtonColor: '#0A4D91'
      });
    } finally {
      setLoading(false);
    }
  };

  const services = [
    { id: 'follow-up', name: 'Follow Up', category: 'General' },
    { id: 'existing-client', name: 'Existing Client Choose on the Day Deposit (Credited to Procedure)(Procedure Performed on Day)', category: 'Existing Client' },
    { id: 'interview', name: 'Interview', category: 'General' },
    { id: 'first-appt-3d', name: 'First Appt 3D Skin Imaging Consult Scans Only (Procedure and Skincare Recommendations)', category: 'New Clients' },
    { id: 'first-appt-deposit', name: 'First Appt Choose on the Day Deposit + 3D Scans (Deposit Credited)(Procedure Performed on Day)', category: 'New Clients' },
    { id: 'skin-analysis', name: 'Skin Analysis', category: 'General' },
    { id: 'facial-review', name: 'Facial Review Consulting', category: 'General' },
    { id: 'second-appt', name: 'Second Appt Deposit (Credited to Procedure)(Procedure Performed on Day)', category: 'Existing Clients' },
    { id: 'group-2x', name: '2x Choose on the Day DEPOSITS (Deposit Credited to Procedure)(Procedure Performed on Day)', category: 'Group Bookings 2+' },
    { id: 'group-3x', name: '3x Choose on the Day DEPOSITS (Deposit Credited to Procedure)(Procedure Performed on Day)', category: 'Group Bookings 2+' },
    { id: 'group-4x', name: '4x Choose on the Day DEPOSITS (Deposit Credited to Procedure)(Procedure Performed on Day)', category: 'Group Bookings 2+' },
    { id: 'dermaflux-hf-meso', name: 'Dermaflux + High Frequency Lifting + MESOTHERAPY (Face Micro Customised)', category: 'Popular Pancake Value' },
    { id: 'dermaflux-hf-meso-peel', name: 'Dermaflux + High Frequency Lifting + MESOTHERAPY (Face Customised) + Celebrity Multivitamin Peel', category: 'Popular Pancake Value' },
    { id: 'six-star-face', name: 'SIX STAR PEEL (Face)', category: 'Six Star Peel' },
    { id: 'six-star-mini', name: 'SIX STAR PEEL MINI (Face)', category: 'Six Star Peel' },
    { id: 'photorejuvenation', name: 'PhotoRejuvenation', category: 'PhotoRejuvenation' },
    { id: 'silhouette-plus', name: 'Silhouette Plus+', category: 'Silhouette Plus+' },
    { id: 'dermampt', name: 'DermaMPT', category: 'DermaMPT' },
    { id: 'laser-face', name: 'Laser Refining (Face)', category: 'Laser Refining CO2' },
    { id: 'laser-face-neck', name: 'Laser Refining (Face + Neck)', category: 'Laser Refining CO2' },
    { id: 'hifu-face-neck', name: 'HIF (Face + Neck) WAS $1999 Now $599 + Complimentary Celebrity Multivitamin Peel + Dermaflux IV', category: 'HIFU' },
    { id: 'meso-eyes', name: 'Mesotherapy (Eyes)', category: 'Mesotherapy' },
    { id: 'meso-ageing', name: 'Mesotherapy (Ageing)(Face)', category: 'Mesotherapy' },
    { id: 'vitamin-a', name: 'Vitamin A Stamping (Detexturising) (Downtime)', category: 'Vitamin A Stamping' },
    { id: 'dermaflux', name: 'Dermaflux', category: 'No Downtime' },
    { id: 'barrier-repair', name: 'Barrier Repair Facial', category: 'No Downtime' },
    { id: 'celebrity-peel', name: 'Celebrity Multivitamin Peel', category: 'No Downtime' },
    { id: 'girlfriend-glow', name: '11 Month Exclusive Membership The Girlfriend Glow Valued at $7190 — Now $6588💍', category: 'Partner Gifting Protocols' },
    { id: 'wife-edit', name: '10 Month Exclusive Membership The Wife Edit Valued at $8,084 — Now $4,598', category: 'Partner Gifting Protocols' },
    { id: 'elite-program', name: 'Elite Personalised Program', category: 'Our Most Popular Protocols' },
    { id: 'laser-hair', name: 'Laser Hair Reduction (Face)', category: 'Laser Hair Reduction' }
  ];

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedServices.length === services.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(services.map(s => s.id));
    }
  };

  const handleFutureServiceToggle = (serviceId) => {
    setSelectedFutureServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectAllFuture = () => {
    if (selectedFutureServices.length === services.length) {
      setSelectedFutureServices([]);
    } else {
      setSelectedFutureServices(services.map(s => s.id));
    }
  };

  const messageTypes = [
    {
      id: 'customer-reminder',
      title: 'Customer reminder',
      subtitle: 'Sent before scheduled time'
    },
    {
      id: 'follow-up',
      title: 'Follow-up',
      subtitle: 'After appointment feedback'
    },
    {
      id: 'rebooking-reminder',
      title: 'Rebooking reminder',
      subtitle: 'Encourage repeat visits'
    },
    {
      id: 'did-not-show',
      title: 'Did not show',
      subtitle: 'Policy follow-ups'
    },
    {
      id: 'booking-changes',
      title: 'Booking changes',
      subtitle: 'Updates and rescheduling'
    },
    {
      id: 'appointment-pencilled',
      title: 'Appointment pencilled-in',
      subtitle: 'Pending confirmation'
    }
  ];

  const timingOptions = [
    'Immediately',
    '1 hour after',
    '7 hours after',
    '24 hours after',
    '2 days after',
    '3 days after',
    '4 days after',
    '5 days after',
    '1 week after',
    '2 weeks after',
    '4 weeks after'
  ];

  const statusOptions = [
    'Not started',
    'Arrived',
    'Started',
    'Completed',
    'Did not show'
  ];

  const placeholderTags = [
    'BUSINESS_NAME',
    'FIRST_NAME',
    'LAST_NAME',
    'LOCATION_NAME',
    'LOCATION_TELEPHONE',
    'STAFF_NAME_FIRST',
    'STAFF_NAME_LAST',
    'BOOKING_DATE_TIME',
    'BOOKING_DATE',
    'BOOKING_TIME',
    'BOOKING_ADDRESS'
  ];

  const handleSave = async () => {
    if (!messageName || !selectedType || !selectedChannel || !messageText) {
      Swal.fire({
        title: 'Missing Fields!',
        text: 'Please fill all required fields',
        icon: 'warning',
        confirmButtonColor: '#0A4D91'
      });
      return;
    }

    setSaving(true);
    try {
      const templateData = {
        name: messageName,
        type: selectedType,
        channel: selectedChannel,
        timing,
        appointmentStatus,
        serviceType,
        selectedServices,
        futureAppointmentType,
        selectedFutureServices,
        sendWithStatus,
        sendNoPrevious,
        sendOnlyOnce,
        messageText,
        status: 'ACTIVE'
      };

      let result;
      if (edit) {
        result = await dispatch(updateTemplate(edit, templateData, router));
      } else {
        result = await dispatch(createTemplate(templateData, router));
      }

      if (result.success) {
        await Swal.fire({
          title: 'Success!',
          text: edit ? 'Template updated successfully!' : 'Template created successfully!',
          icon: 'success',
          confirmButtonColor: '#0A4D91'
        });
        router.push('/Notifications');
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to save template',
          icon: 'error',
          confirmButtonColor: '#0A4D91'
        });
      }
    } catch (error) {
      console.error('Error saving template:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save template',
        icon: 'error',
        confirmButtonColor: '#0A4D91'
      });
    } finally {
      setSaving(false);
    }
  };

  const remainingChars = 160 - messageText.length;
  const smsUsed = Math.ceil(messageText.length / 160);

  const showDetailedForm = selectedType && selectedChannel;

  if (loading) {
    return (
      <div className="p-4 md:p-6 bg-custom-gray min-h-screen flex items-center justify-center">
        <div className="text-[#0a4d91]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-custom-gray min-h-screen">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span 
          className="cursor-pointer hover:text-[#0a4d91]"
          onClick={() => router.push('/Notifications')}
        >
          Customer messages
        </span>
        <span>›</span>
        <span className="text-gray-700">{edit ? 'Edit' : 'Add'} Message</span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#0a4d91]">Customer Messages</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/Notifications')}
            className="px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#0A4D91] text-white transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="bg-[#e3f2fd] rounded-full p-2 mt-1">
                <MessageSquare size={20} color="#0a4d91" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  What type of automated message do you want to set up?
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messageTypes.map((type) => (
                <label
                  key={type.id}
                  className={`relative flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedType === type.id
                      ? 'border-[#0a4d91] bg-[#e3f2fd]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="messageType"
                    value={type.id}
                    checked={selectedType === type.id}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mt-1 w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91]"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-[15px]">{type.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{type.subtitle}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="bg-[#e3f2fd] rounded-full p-2 mt-1">
                <Mail size={20} color="#0a4d91" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  Send this as an email or SMS?
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedChannel === 'SMS'
                    ? 'border-[#0a4d91] bg-[#e3f2fd]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <MessageSquare size={20} color={selectedChannel === 'SMS' ? '#0a4d91' : '#6b7280'} />
                <span className="font-semibold text-gray-800 flex-1">SMS</span>
                <input
                  type="radio"
                  name="channel"
                  value="SMS"
                  checked={selectedChannel === 'SMS'}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91]"
                />
              </label>

              <label
                className={`relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedChannel === 'Email'
                    ? 'border-[#0a4d91] bg-[#e3f2fd]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Mail size={20} color={selectedChannel === 'Email' ? '#0a4d91' : '#6b7280'} />
                <span className="font-semibold text-gray-800 flex-1">Email</span>
                <input
                  type="radio"
                  name="channel"
                  value="Email"
                  checked={selectedChannel === 'Email'}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-5 h-5 text-[#0a4d91] focus:ring-[#0a4d91]"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {showWarning && !edit && (
            <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-[#0a4d91]">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-[#e3f2fd] rounded-full p-2">
                  <HelpCircle size={20} color="#0a4d91" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">Existing Configuration</h3>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                You already have an SMS for customer reminder set up in your system. Creating a new one may cause duplicate notifications.
              </p>

              <button className="w-full bg-[#0A4D91] text-white py-3 rounded-lg font-medium transition-colors mb-3">
                Edit existing customer reminder SMS
              </button>

              <button 
                onClick={() => setShowWarning(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Dismiss this warning
              </button>
            </div>
          )}

          <div className="bg-[#fffbf0] rounded-lg shadow-sm p-6 border-l-4 border-[#fbbf24]">
            <div className="flex items-start gap-3 mb-3">
              <Lightbulb size={20} color="#f59e0b" className="mt-0.5 flex-shrink-0" />
              <h3 className="font-semibold text-gray-800">PRO TIP</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Reminders sent 24 hours in advance can reduce no-shows by up to 30%.
            </p>
          </div>
        </div>
      </div>

      {showDetailedForm && (
        <div className="max-w-full mt-6 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">3. {selectedChannel} Rules</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Choose when you'd like the message to be sent and if you would like this to be sent for all bookings, or bookings with a specific service.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Send {selectedChannel}:</label>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <select 
                        value={timing}
                        onChange={(e) => setTiming(e.target.value)}
                        className="px-3 py-2 border text-gray-700 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0a4d91] focus:border-transparent"
                      >
                        {timingOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <span className="text-sm text-gray-600">after an appointment ends</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 italic">
                      All bookings that ended after 3:35pm on Monday, 8 April, 2026 will be eligible to have this message sent.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">For an appointment containing:</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="serviceType"
                          value="any"
                          checked={serviceType === 'any'}
                          onChange={(e) => setServiceType(e.target.value)}
                          className="w-4 h-4 text-[#0a4d91] focus:ring-[#0a4d91]"
                        />
                        <span className="text-sm text-gray-700">Any service</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer flex-1">
                          <input
                            type="radio"
                            name="serviceType"
                            value="selected"
                            checked={serviceType === 'selected'}
                            onChange={(e) => {
                              setServiceType(e.target.value);
                              setShowServiceModal(true);
                            }}
                            className="w-4 h-4 text-[#0a4d91] focus:ring-[#0a4d91]"
                          />
                          <span className="text-sm text-gray-700">
                            Selected services {selectedServices.length > 0 && `(${selectedServices.length} selected)`}
                          </span>
                        </label>
                        {serviceType === 'selected' && selectedServices.length > 0 && (
                          <button
                            onClick={() => setShowServiceModal(true)}
                            className="text-sm text-[#0a4d91] hover:underline font-medium"
                          >
                            View / Change
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">And, customer has no future appointments containing:</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="futureAppointmentType"
                          value="any"
                          checked={futureAppointmentType === 'any'}
                          onChange={(e) => setFutureAppointmentType(e.target.value)}
                          className="w-4 h-4 text-[#0a4d91] focus:ring-[#0a4d91]"
                        />
                        <span className="text-sm text-gray-700">Any service</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer flex-1">
                          <input
                            type="radio"
                            name="futureAppointmentType"
                            value="selected"
                            checked={futureAppointmentType === 'selected'}
                            onChange={(e) => {
                              setFutureAppointmentType(e.target.value);
                              setShowFutureServiceModal(true);
                            }}
                            className="w-4 h-4 text-[#0a4d91] focus:ring-[#0a4d91]"
                          />
                          <span className="text-sm text-gray-700">
                            Selected services {selectedFutureServices.length > 0 && `(${selectedFutureServices.length} selected)`}
                          </span>
                        </label>
                        {futureAppointmentType === 'selected' && selectedFutureServices.length > 0 && (
                          <button
                            onClick={() => setShowFutureServiceModal(true)}
                            className="text-sm text-[#0a4d91] hover:underline font-medium"
                          >
                            View / Change
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={sendWithStatus}
                        onChange={(e) => setSendWithStatus(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-gray-700">Send to appointments with status of</span>
                          <select 
                            value={appointmentStatus}
                            onChange={(e) => setAppointmentStatus(e.target.value)}
                            className="px-2 py-1 text-gray-700 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0a4d91]"
                            disabled={!sendWithStatus}
                          >
                            {statusOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                          <HelpCircle size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={sendNoPrevious}
                        onChange={(e) => setSendNoPrevious(e.target.checked)}
                        className="w-4 h-4 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                      />
                      <span className="text-sm text-gray-700">Send to customers with no previous appointments.</span>
                      <HelpCircle size={16} className="text-gray-400" />
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={sendOnlyOnce}
                        onChange={(e) => setSendOnlyOnce(e.target.checked)}
                        className="w-4 h-4 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                      />
                      <span className="text-sm text-gray-700">Send to each customer only once.</span>
                      <HelpCircle size={16} className="text-gray-400" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">4. {selectedChannel} template</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Copy and paste the placeholder tag below to insert dynamic content into your messages.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                  {placeholderTags.map(tag => (
                    <div key={tag} className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      {tag}
                    </div>
                  ))}
                </div>

                {showCostInfo && selectedChannel === 'SMS' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 relative">
                    <button 
                      onClick={() => setShowCostInfo(false)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                    <div className="flex items-start gap-3">
                      <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm mb-2">SMS cost info</h3>
                        <p className="text-xs text-gray-600 mb-1">Cost will depend on the length of message:</p>
                        <p className="text-xs text-gray-600">Regular 1 SMS credit (up to 138 characters)</p>
                        <p className="text-xs text-gray-600">Large 2 SMS credits (up to 284 characters)</p>
                        <p className="text-xs text-gray-600">Grande 3 SMS credits (up to 437 characters)</p>
                        <p className="text-xs text-gray-600 mt-1">NOTE: Overage charges apply.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your message</label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0a4d91] focus:border-transparent resize-none"
                    placeholder="Enter your message..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <button className="text-sm text-gray-600 hover:text-gray-800">Reset to default</button>
                    <span className="text-xs text-gray-500">
                      Approx. {remainingChars} characters remaining with {smsUsed} SMS used
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                  <div className="bg-[#4a5568] text-white rounded-lg p-4 text-sm">
                    <p className="leading-relaxed">
                      {messageText} {selectedChannel === 'SMS' && 'Reply STOP to opt-out'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">5. Message name</h2>
                <p className="text-sm text-gray-600 mb-4">Give your message a descriptive name.</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message name (required)
                  </label>
                  <input
                    type="text"
                    value={messageName}
                    onChange={(e) => setMessageName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 text-gray-700 focus:ring-[#0a4d91] focus:border-transparent"
                    placeholder="Enter message name"
                  />
                </div>
              </div>
        </div>
      )}

      {showDetailedForm && (
        <div className="flex justify-end gap-3 mt-8">
          <button 
            onClick={() => router.push('/Notifications')}
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
      )}

      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Select services</h2>
              <button 
                onClick={() => setShowServiceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-sm text-gray-600 mb-4">
                Select the services this message should send for:
              </p>

              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedServices.length === services.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                />
                <span className="text-sm font-medium text-gray-700">Select all</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map((service) => (
                  <label key={service.id} className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="mt-0.5 w-4 h-4 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                    />
                    <span className="text-sm text-gray-700 leading-tight">{service.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <button 
                onClick={() => setShowServiceModal(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowServiceModal(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#0A4D91] text-white transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showFutureServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Select services</h2>
              <button 
                onClick={() => setShowFutureServiceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-sm text-gray-600 mb-4">
                Select the services this message should send for:
              </p>

              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFutureServices.length === services.length}
                  onChange={handleSelectAllFuture}
                  className="w-4 h-4 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                />
                <span className="text-sm font-medium text-gray-700">Select all</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map((service) => (
                  <label key={service.id} className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFutureServices.includes(service.id)}
                      onChange={() => handleFutureServiceToggle(service.id)}
                      className="mt-0.5 w-4 h-4 text-[#0a4d91] focus:ring-[#0a4d91] rounded"
                    />
                    <span className="text-sm text-gray-700 leading-tight">{service.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <button 
                onClick={() => setShowFutureServiceModal(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowFutureServiceModal(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#0A4D91] text-white transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMessage;
