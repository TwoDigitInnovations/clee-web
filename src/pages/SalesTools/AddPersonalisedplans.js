import React, { useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/deleteModel";
import { useDispatch } from "react-redux";
import { fetchUsers } from "@/redux/actions/userActions";
import { fetchServices } from "@/redux/actions/servicesActions";

function AddPersonalisedplans() {
  const dispath = useDispatch();
  const role = "user";

  useEffect(() => {
    fetchUsers(role);
  }, []);

  useEffect(() => {
    fetchServices(role);
  }, []);

  const handleSubmit = async () => {
    

    loader(true);

    const data = {
  
    };

    

    try {
      const res = await dispatch(saveTemplate(id, data, router));

      if (res?.success) {
        toaster({ type: "success", message: res.message });

      } else {
        toaster({
          type: "error",
          message: res.message || "Something went wrong",
        });
      }
    } catch (err) {
      toaster({
        type: "error",
        message: "Server error",
      });
      console.log(err);
    } finally {
      loader(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <DashboardHeader title="Sales Tools" />

      <div className="md:p-6 p-4 max-w-7xl mx-auto"></div>



    </div>
  );
}

export default AddPersonalisedplans;
