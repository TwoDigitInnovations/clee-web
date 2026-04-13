"use client";
import React from "react";
import { X, Info } from "lucide-react";

function ImportCustomer({ onClose, loader, toaster }) {
  const handleDownload = () => {
    // Example API call
    loader(true);
    setTimeout(() => {
      loader(false);
      toaster({ type: "success", message: "Template downloaded" });
    }, 1000);
  };

  const handleTestUpload = () => {
    loader(true);
    setTimeout(() => {
      loader(false);
      toaster({ type: "success", message: "Test file uploaded" });
    }, 1000);
  };

  const handleImport = () => {
    loader(true);
    setTimeout(() => {
      loader(false);
      toaster({ type: "success", message: "Import completed" });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg max-h-[95Vh] overflow-x-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Import customers
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Step 1 */}
          <div>
            <h3 className="font-semibold text-gray-800">
              1. Download template
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Download the spreadsheet template.
            </p>
            <button
              onClick={handleDownload}
              className="mt-3 px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100"
            >
              Download template
            </button>
          </div>

          {/* Step 2 */}
          <div>
            <h3 className="font-semibold text-gray-800">
              2. Fill in the template
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Fill in your customer details using the format provided in our
              help guide.
            </p>
            <button className="mt-3 px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100">
              Check help guide
            </button>
          </div>

          {/* Step 3 */}
          <div>
            <h3 className="font-semibold text-gray-800">3. Test the file</h3>
            <p className="text-sm text-gray-500 mt-1">
              We will review if all data is in the right format, and send the
              test result to your email within 15 minutes.
            </p>
            <button
              onClick={handleTestUpload}
              className="mt-3 px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100"
            >
              Upload file for test
            </button>
          </div>

          {/* Step 4 */}
          <div>
            <h3 className="font-semibold text-gray-800">4. Complete import</h3>
            <p className="text-sm text-gray-500 mt-1">
              Once you receive the confirmation email that there is no error,
              complete the import.
            </p>
            <button
              onClick={handleImport}
              className="mt-3 px-5 py-2 rounded-md text-sm font-medium text-white bg-custom-blue hover:bg-custom-blue/90"
            >
              Upload file for import
            </button>
          </div>

          {/* Info Box */}
          <div className="flex gap-3 p-4 bg-gray-100 rounded-md">
            <Info className="w-5 h-5 text-indigo-500 mt-1" />
            <div>
              <p className="font-medium text-gray-800">
                Coming from another system?
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Our team is more than happy to help you import your customers
                from other systems, so if you'd prefer, email us at{" "}
                <span className="text-indigo-600 underline cursor-pointer">
                  success@getClee.com
                </span>{" "}
                and we'll help you out!!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportCustomer;
