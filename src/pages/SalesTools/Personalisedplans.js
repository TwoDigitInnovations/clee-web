import React from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/deleteModel";

function Personalisedplans() {
  const handleDeleteConfirm = async () => {
    try {
      loader(true);

      const res = await dispatch(deleteTemplate(selectedId, router));

      loader(false);

      if (res?.success) {
        toaster("success", "Template deleted successfully");
        setOpen(false);
      } else {
        toaster("error", res.message);
      }
    } catch {
      loader(false);
      toaster("error", "Server error");
    }
  };


  
  return (
    <div className="bg-gray-50 min-h-screen">
      <DashboardHeader title="Sales Tools" />

      <div className="md:p-6 p-4 max-w-7xl mx-auto"></div>
      <ConfirmModal
        isOpen={open}
        setIsOpen={setOpen}
        title="Delete Staff"
        message="Are you sure you want to delete this staff member?"
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />
    </div>
  );
}

export default Personalisedplans;
