import React from "react";
import { User, Phone, MapPin, MapPinned, Banknote, CreditCard, Clock } from "lucide-react";

export default function DeliveryInfo({ address, status }) {
  if (!address) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center mt-6">
        <p className="text-gray-500 text-sm">Delivery address not provided yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-5 mt-6 mb-4">
      <h3 className="font-semibold text-lg text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
        <MapPinned className="text-orange-500 w-5 h-5" />
        Delivery Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact info element */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex justify-center items-center text-blue-500">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Receiver</p>
              <p className="font-bold text-gray-800">{address.fullName || "John Doe"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-50 flex justify-center items-center text-green-500">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Phone Contact</p>
              <p className="font-bold text-gray-800">{address.phoneNumber || "+91 99XXXXXX00"}</p>
            </div>
          </div>
        </div>

        {/* Address and details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex justify-center items-center text-orange-500 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Address</p>
              <p className="font-medium text-gray-800 text-sm">{address.streetAddress || "Street Address"}</p>
              <p className="font-medium text-gray-600 text-sm">
                {address.city || "City"} - {address.pincode || "000000"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex justify-center items-center text-purple-500">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Payment Option</p>
              <p className="font-bold text-gray-800">Cash on Delivery</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-orange-50 px-4 py-3 rounded-lg flex items-center justify-between border border-orange-100">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          <span className="font-semibold text-gray-700 text-sm">Delivery Partner assigned</span>
        </div>
        <span className="text-xs font-bold bg-white text-orange-600 px-3 py-1 rounded shadow-sm">
          {status === "Preparing" || status === "Pending" ? "Waiting..." : "Swiggy Agent"}
        </span>
      </div>
    </div>
  );
}
