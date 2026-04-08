import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Edit2, Trash2, Mail, MessageSquare } from 'lucide-react';
import Swal from 'sweetalert2';
import { ConfirmModal } from '../../components/deleteModel';
import { fetchTemplates, deleteTemplate } from '../../redux/actions/notificationActions';

const CustomerMessage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { templates: messages, loading } = useSelector((state) => state.notification);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchTemplates(router));
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setTemplateToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;

    try {
      const deleteResult = await dispatch(deleteTemplate(templateToDelete, router));
      if (deleteResult.success) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Template has been deleted.',
          icon: 'success',
          confirmButtonColor: '#0A4D91'
        });
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete template',
        icon: 'error',
        confirmButtonColor: '#0A4D91'
      });
    } finally {
      setTemplateToDelete(null);
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
        <h1 className="text-2xl md:text-3xl font-semibold text-[#0a4d91]">
          Customer Messages
        </h1>
        <button 
          onClick={() => router.push('/notification/AddMessage')}
          className="bg-[#0A4D91] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Add a New Message
        </button>
      </div>

      <div className="bg-[#dce9f5] border-l-4 border-[#0a4d91] rounded-lg p-6 mb-6 relative">
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#0a4d91] mb-3 flex items-center gap-2">
              <span className="text-lg">✨</span> Appointment reminders
            </h3>
            <p className="text-sm text-[#5a6c7d] leading-relaxed mb-3">
              Avoid no-shows with appointment reminders, keep clients coming back with follow-up messages, and ensure every booking change is communicated instantly.
            </p>
            <a href="#" className="text-sm text-[#0a4d91] font-medium hover:underline inline-flex items-center gap-1">
              Learn more about smart rules <span>→</span>
            </a>
          </div>
          <div className="bg-[#b8d4ea] rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
            <Calendar size={32} color="#0a4d91" strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-[#f8f9fa]">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-[#5f6368] uppercase tracking-wider">
                  RULE NAME & DESCRIPTION
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-[#5f6368] uppercase tracking-wider">
                  CHANNEL
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-[#5f6368] uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-[#5f6368] uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No notification templates found. Create your first template!
                  </td>
                </tr>
              ) : (
                messages.map((message, index) => (
                  <tr key={message._id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === messages.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-4 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="text-[15px] font-semibold text-[#202124]">{message.name}</div>
                        <div className="text-[13px] text-[#5f6368] leading-relaxed">{message.messageText?.substring(0, 100)}...</div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className="inline-flex items-center gap-2 bg-[#e3f2fd] text-[#0a4d91] px-3 py-1.5 rounded text-[13px] font-medium">
                        {message.channel === 'SMS' ? (
                          <><MessageSquare size={14} /> SMS</>
                        ) : (
                          <><Mail size={14} /> Email</>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <span className={`text-[13px] font-semibold ${
                        message.status === 'ACTIVE' ? 'text-[#2e7d32]' : 'text-[#f57c00]'
                      }`}>
                        ● {message.status}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => router.push(`/notification/AddMessage?edit=${message._id}`)}
                          className="text-[#0a4d91] hover:text-[#164a7f] transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(message._id)}
                          className="text-[#dc3545] hover:text-[#bb2d3b] transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-[#5f6368]">Showing {messages.length} entries</div>
          <div className="flex gap-2 flex-wrap justify-center">
            <button 
              className={`px-3 py-2 rounded border text-sm transition-colors ${
                currentPage === 1 
                  ? 'bg-[#0a4d91] text-white border-[#0a4d91]' 
                  : 'bg-white text-[#5f6368] border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
          </div>
        </div>
      )}
      
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Template"
        message="Are you sure you want to delete this notification template? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        yesText="Delete"
        noText="Cancel"
      />
    </div>
  );
};

export default CustomerMessage;
