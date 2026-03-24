"use client";
import React, { useState } from "react";
import InputField from "./UI/InputField";
import SelectField from "./UI/SelectField";
import TextareaField from "./UI/TextAreaField";
import { TextAlignStart, User, X } from "lucide-react";

const AddWaitlist = ({ onClose, loader, toaster }) => {
  const [formData, setFormData] = useState({
    customer: "",
    mobile: "",
    phone: "",
    email: "",
    service: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.customer) {
      toaster({ type: "error", message: "Customer is required" });
      return;
    }

    if (!formData.service) {
      toaster({ type: "error", message: "Please select a service" });
      return;
    }

    try {
      loader(true);

      const res = await Api(
        "post",
        "waitlist/create", // 🔥 change endpoint if needed
        formData,
      );

      loader(false);

      if (res?.status === true) {
        toaster({
          type: "success",
          message: "Waitlist added successfully",
        });

        // reset form
        setFormData({
          customer: "",
          mobile: "",
          phone: "",
          email: "",
          service: "",
          notes: "",
        });

        onClose(); // close modal
      } else {
        toaster({
          type: "error",
          message: res?.message || "Something went wrong",
        });
      }
    } catch (err) {
      loader(false);

      toaster({
        type: "error",
        message: "Server error",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-50 w-[95%] max-w-2xl bg-white rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add to waitlist</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 text-sm font-semibold text-custom-blue flex gap-2">
            <User size={18} /> CUSTOMER INFORMATION
          </div>

          <SelectField
            label="Customer name"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            options={["Search or select customer"]}
          />

          <InputField
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="(555) 000-0000"
          />

          <InputField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 000-0000"
          />

          <InputField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="customer@example.com"
          />

          {/* Service Section */}
          <div className="col-span-2 text-sm font-semibold text-custom-blue mt-2">
            SERVICE SELECTION
          </div>

          <SelectField
            label="Select a service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            options={["Select a service..."]}
          />

          <button className="col-span-2 text-custom-blue text-sm text-left">
            + Add another service
          </button>

          {/* Additional Details */}
          <div className="flex gap-2 col-span-2 text-sm font-semibold text-custom-blue mt-2">
            <TextAlignStart size={18} /> ADDITIONAL DETAILS
          </div>

          <TextareaField
            label="Appointment preferences (staff, day of the week, time of day etc)"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g. Prefer mornings, specifically with Jamie on Tuesdays..."
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-custom-blue text-white"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWaitlist;
