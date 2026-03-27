import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/router";
import { Plus, Home, Edit2, Trash2 } from "lucide-react"; // Assuming you use lucide for icons
import { ConfirmModal } from "@/components/deleteModel";

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
  const [locations, setLocations] = useState(dummyLocations);
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const fetchLocations = async () => {
    try {
      props.loader(true);
      const res = await Api("get", `auth/getLocations`, "", router);
      props.loader(false);
      if (res?.status === true) {
        setLocations(res.data || []);
      }
    } catch (err) {
      props.loader(false);
      props.toaster({ type: "error", message: "Failed to fetch locations" });
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDeleteClick = (id) => {
    setId(id);
    setOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!id) return;

    props.loader(true);
    Api("delete", `auth/deleteLocation/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          props.toaster({
            type: "success",
            message: res?.data?.message || "Location deleted successfully",
          });
          fetchLocations();
          setId("");
          setOpen(false);
        } else {
          props.toaster({
            type: "success",
            message: res?.data?.message || "Failed to delete Location",
          });
        }
      })
      .catch((err) => {
        props.loader(false);
        props.toaster({
          type: "error",
          message: err?.data?.message || "An error occurred",
        });
      });
  };

  return (
    <>
      <DashboardHeader title="Your Business" />

      <div className="min-h-screen bg-[#f8f9fb] text-slate-800 px-8 py-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#1e4e8c]">Locations</h2>
          <button
            onClick={() => router.push("/Business/AddLocation")}
            className="bg-[#0b4d92] text-white px-4 py-3 rounded-md text-sm font-medium hover:bg-[#083a6f] transition-colors"
          >
            Add Locations
          </button>
        </div>

        <hr className="border-gray-200 mb-4" />

        <div className="space-y-4">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="flex items-center justify-between bg-white p-5 rounded-lg border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#f0f4f8] p-3 rounded-md">
                  <Home size={20} className="text-[#0b4d92]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0b4d92] text-sm">
                    {loc.name || "Chebo Clinic"}
                  </h4>
                  <p className="text-gray-500 text-xs mt-1">
                    {loc.address ||
                      "59 Montgomery Street Kogarah, Sydney, NSW, 221"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/locations/edit/${loc.id}`)}
                  className="bg-[#0b4d92] text-white px-6 py-2 rounded-md text-sm font-semibold flex items-center"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(loc.id)}
                  className="p-2 border border-gray-200 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
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
