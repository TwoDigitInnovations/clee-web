"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import InputField from "./UI/InputField";
import SelectField from "./UI/SelectField";
import TextareaField from "./UI/TextAreaField";
import { TextAlignStart, User, X } from "lucide-react";
import { Api } from "@/services/service";
import {
  createWaitlist,
  updateWaitlist,
} from "@/redux/actions/waitlistActions";
import { fetchServices } from "@/redux/actions/servicesActions";
import { fetchCustomers } from "@/redux/actions/productActions";
import { fetchUsers } from "@/redux/actions/userActions";

const AddWaitlist = ({ onClose, loader, toaster, editId }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  // const [customers, setCustomers] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    customer: "",
    mobile: "",
    phone: "",
    email: "",
    service: "",
    notes: "",
  });

  const { services: services, loading } = useSelector(
    (state) => state.services,
  );
  const { users: customers } = useSelector((state) => state.user);
  let role = "user";



  useEffect(() => {
    dispatch(fetchServices(router));
    dispatch(fetchUsers(router, role));
  }, [dispatch]);

  useEffect(() => {
    if (editId) {
      fetchWaitlistData();
    }
  }, [editId]);

  const fetchWaitlistData = async () => {
    try {
      loader(true);
      const res = await Api("get", `waitlist/get/${editId}`, "", router);
      loader(false);

      if (res?.status && res.data?.data) {
        const waitlistData = res.data.data;
        const customer = waitlistData.customer;

        setFormData({
          customer: customer._id,
          mobile: customer.mobile || "",
          phone: customer.phone || customer.telephone || "",
          email: customer.email || "",
          service: "",
          notes: waitlistData.notes || "",
        });

        if (Array.isArray(waitlistData.service)) {
          setSelectedServices(waitlistData.service);
        } else if (waitlistData.service) {
          setSelectedServices([waitlistData.service]);
        }
      }
    } catch (err) {
      loader(false);
      toaster({ type: "error", message: "Failed to fetch waitlist data" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "customer") {
      const customer = customers.find((c) => c._id === value);
      if (customer) {
        setFormData({
          ...formData,
          customer: value,
          mobile: customer.mobile || "",
          phone: customer.phone || customer.telephone || "",
          email: customer.email || "",
        });
      }
    } else if (name === "service") {
      if (value && value !== "Select a service...") {
        if (!selectedServices.includes(value)) {
          setSelectedServices([...selectedServices, value]);
        }

        setTimeout(() => {
          setFormData({ ...formData, service: "" });
        }, 0);
      }
    } else {
      setFormData({ ...formData, [name]: value });
      const error = validateField(name, value);

      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleRemoveService = (serviceToRemove) => {
    setSelectedServices(selectedServices.filter((s) => s !== serviceToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toaster({
        type: "error",
        message: Object.values(newErrors)[0],
      });
      return;
    }

    if (!formData.customer) {
      toaster({ type: "error", message: "Customer is required" });
      return;
    }

    if (selectedServices.length === 0) {
      toaster({ type: "error", message: "Please select at least one service" });
      return;
    }

    try {
      loader(true);

      const waitlistData = {
        customer: formData.customer,
        service: selectedServices,
        notes: formData.notes || "No notes",
      };

      let result;
      if (editId) {
        result = await dispatch(updateWaitlist(editId, waitlistData, router));
      } else {
        result = await dispatch(createWaitlist(waitlistData, router));
      }

      loader(false);

      if (result?.success) {
        toaster({
          type: "success",
          message:
            result.message ||
            (editId
              ? "Waitlist updated successfully"
              : "Waitlist added successfully"),
        });

        setFormData({
          customer: "",
          mobile: "",
          phone: "",
          email: "",
          service: "",
          notes: "",
        });
        setSelectedServices([]);

        onClose();
      } else {
        toaster({
          type: "error",
          message: result?.message || "Something went wrong",
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

  const validateField = (name, value) => {
    let error = "";

    if (name === "mobile" || name === "phone") {
      if (!/^[0-9]*$/.test(value)) {
        return (error = "Only Number are Allowed");
      }
    }

    if (name === "mobile" || name === "phone") {
      const cleaned = value.replace(/\D/g, ""); // sirf digits

      if (cleaned.length < 7 || cleaned.length > 10) {
        error = "Number must be between 7 to 10 digits";
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Invalid email format";
      }
    }

    return error;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-50 w-[95%] max-w-2xl max-h-[85vh] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 pb-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold">
            {editId ? "Edit Waitlist" : "Add to waitlist"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div
          className="overflow-y-auto flex-1 px-6 py-4"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 text-sm font-semibold text-custom-blue flex gap-2">
              <User size={18} /> CUSTOMER INFORMATION
            </div>

            <SelectField
              label="Customer name"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              options={[
                "Search or select customer",
                ...customers.map((c) => ({ value: c._id, label: c.fullname })),
              ]}
            />

            <InputField
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="(555) 000-0000"
              error={errors.mobile}
            />

            <InputField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 000-0000"
              error={errors.phone}
            />

            <InputField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="customer@example.com"
            />

        
            <div className="col-span-2 text-sm font-semibold text-custom-blue mt-2">
              SERVICE SELECTION
            </div>

            <SelectField
              label="Select a service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              options={[
                "Select a service...",
                ...services.map((s) => ({ value: s.name, label: s.name })),
              ]}
            />

            {selectedServices.length > 0 && (
              <div className="col-span-2">
                <p className="text-xs text-gray-500 mb-2">Selected services:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-blue-50 text-custom-blue px-3 py-1.5 rounded-lg text-sm"
                    >
                      <span>{service}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(service)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          
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
        </div>

        <div className="flex justify-end gap-3 p-6 pt-4 border-t bg-gray-50 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-custom-blue text-white hover:bg-blue-700 transition-colors"
            onClick={handleSubmit}
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWaitlist;
