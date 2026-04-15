import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/router";
import { Plus, Home, Edit2, Trash2 } from "lucide-react"; // Assuming you use lucide for icons
import { ConfirmModal } from "@/components/deleteModel";
import { Api } from "@/services/service";
import {
  deleteLocation,
  fetchLocations,
} from "@/redux/actions/locationActions";
import { useDispatch, useSelector } from "react-redux";

const dummyLocations = [
  {
    id: 1,
    location_name: "Chebo Clinic",
    telephone: "+61 2 1234 5678",
    location_type: "fixed",
    book_online: true,
    street: "59 Montgomery Street",
    suburb: "Kogarah",
    city: "Sydney",
    state: "NSW",
    postal_code: "221",
    hours: {
      Monday: { enabled: true, open: "9:00 am", close: "5:00 pm" },
      Tuesday: { enabled: true, open: "9:00 am", close: "5:00 pm" },
      Wednesday: { enabled: true, open: "9:00 am", close: "5:00 pm" },
      Thursday: { enabled: true, open: "9:00 am", close: "5:00 pm" },
      Friday: { enabled: true, open: "9:00 am", close: "5:00 pm" },
      Saturday: { enabled: false, open: "9:00 am", close: "5:00 pm" },
      Sunday: { enabled: false, open: "9:00 am", close: "5:00 pm" },
    },
  },
  {
    id: 2,
    location_name: "North Sydney Wellness",
    telephone: "+61 2 9876 5432",
    location_type: "fixed",
    book_online: false,
    street: "12 Miller St",
    suburb: "North Sydney",
    city: "Sydney",
    state: "NSW",
    postal_code: "2060",
    hours: {
      Monday: { enabled: true, open: "8:00 am", close: "6:00 pm" },
      Tuesday: { enabled: true, open: "8:00 am", close: "6:00 pm" },
      Wednesday: { enabled: true, open: "8:00 am", close: "6:00 pm" },
      Thursday: { enabled: true, open: "8:00 am", close: "6:00 pm" },
      Friday: { enabled: true, open: "10:00 am", close: "4:00 pm" },
      Saturday: { enabled: true, open: "10:00 am", close: "2:00 pm" },
      Sunday: { enabled: false, open: "9:00 am", close: "5:00 pm" },
    },
  },
];
function Locations(props) {
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const location = useSelector((state) => state.location?.locations || []);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setId(id);
    setOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      props.loader(true);

      const res = await dispatch(deleteLocation(id, router));

      props.loader(false);

      if (res?.status) {
        props.toaster({
          type: "success",
          message: res?.data?.message || "Location deleted successfully",
        });

        setId("");
        setOpen(false);
        setOpen(false);
      } else {
        props.toaster("error", res.message);
      }
    } catch {
      props.loader(false);
      props.toaster({ type: "error", message: "Server error" });
    }
  };

  return (
    <>
      <DashboardHeader title="Your Business" />
      <div className="min-h-screen bg-[#f8f9fb] text-slate-800 md:px-6 px-3 py-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-custom-blue">
            Locations
          </h2>
          <button
            onClick={() => router.push("/Business/AddLocation")}
            className="bg-custom-blue text-white px-4 py-3 rounded-md text-sm font-medium hover:bg-[#083a6f] transition-colors"
          >
            Add Locations
          </button>
        </div>

        <hr className="border-gray-200 mb-4" />

        <div className="space-y-4">
          {location?.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[550px] text-center bg-white border border-gray-100 rounded-lg shadow-sm">
              <div className="bg-gray-100 p-4 rounded-full mb-3">
                <Home size={40} className="text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700">
                No Locations Found
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                You haven’t added any locations yet.
              </p>
            </div>
          ) : (
            location?.map((loc) => (
              <div
                key={loc._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 sm:p-5 rounded-lg border border-gray-100 shadow-sm gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#f0f4f8] p-3 rounded-md">
                    <Home size={20} className="text-custom-blue" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-custom-blue text-sm">
                        {loc.location_name || "Chebo Clinic"}
                      </h4>

                      <span className="text-[10px] px-2 py-1 rounded-full bg-blue-100 text-blue-600 capitalize">
                        {loc.location_type}
                      </span>
                    </div>

                    {loc.location_type === "mobile" ? (
                      <p className="text-gray-500 text-xs mt-1">
                        📞 {loc.telephone || "No phone number"}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-xs mt-1">
                        {[
                          loc.address?.apartment,
                          loc.address?.street,
                          loc.address?.suburb,
                          loc.address?.city,
                          loc.address?.state,
                          loc.address?.postal_code,
                        ]
                          .filter(Boolean) // empty values remove
                          .join(", ") || "No address available"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 justify-end sm:justify-normal">
                  <button
                    onClick={() =>
                      router.push(`/Business/AddLocation?id=${loc._id}`)
                    }
                    className="bg-custom-blue text-white px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteClick(loc._id)}
                    className="p-2 border border-gray-200 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={open}
        setIsOpen={setOpen}
        title="Delete Location"
        message={`Are you sure you want to delete this Location ?`}
        onConfirm={handleDeleteConfirm}
        yesText="Yes, Delete"
        noText="Cancel"
      />
    </>
  );
}

export default Locations;
