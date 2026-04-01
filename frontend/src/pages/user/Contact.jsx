import React, { useState } from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { MapPin, Phone, Mail, Clock, Send, Instagram, Facebook, Twitter } from "lucide-react";
import { sendContactMessage } from "../../services/contactService";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await sendContactMessage(formData);
        setShowSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setTimeout(() => setShowSuccess(false), 5000);
      } catch (err) {
        console.error("Error sending contact message:", err);
        setErrors({ general: "Something went wrong. Please try again later." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-50 to-orange-50 flex flex-col">
      <Header />
      
      {/* Main Content Container */}
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight mb-3">
              Get in <span className="text-orange-500">Touch</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto text-base">
              Have questions or feedback? We'd love to hear from you. Fill out the form below and our team will get back to you shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Left Column: Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4">
                  Contact Information
                </h3>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-50 flex items-center justify-center rounded-xl text-orange-500 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Our Location</h4>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                      21, Alanganallur<br />Madurai, Tamil Nadu 625501
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-50 flex items-center justify-center rounded-xl text-orange-500 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Phone Number</h4>
                    <p className="text-gray-500 text-sm mt-1">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-50 flex items-center justify-center rounded-xl text-orange-500 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Email Address</h4>
                    <p className="text-gray-500 text-sm mt-1">cravecard@gourmetdelights.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-50 flex items-center justify-center rounded-xl text-orange-500 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">Business Hours</h4>
                    <p className="text-gray-500 text-sm mt-1">Mon - Sun: 10:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-colors shadow-sm">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-colors shadow-sm">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-colors shadow-sm">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Send us a Message</h3>
                
                {showSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                       <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div>
                        <p className="text-green-800 text-sm font-bold">Message Sent!</p>
                        <p className="text-green-700 text-xs mt-0.5">Thank you for reaching out. We'll get back to you soon.</p>
                    </div>
                  </div>
                )}

                {errors.general && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm font-medium">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm disabled:opacity-70`}
                      />
                      {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm disabled:opacity-70`}
                      />
                      {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="+91 99999 00000"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? "border-red-300 bg-red-50" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm disabled:opacity-70`}
                      />
                      {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="How can we help?"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.subject ? "border-red-300 bg-red-50" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm disabled:opacity-70`}
                      />
                      {errors.subject && <p className="text-xs text-red-500 font-medium">{errors.subject}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Write your message here..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.message ? "border-red-300 bg-red-50" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none text-sm disabled:opacity-70`}
                    />
                    {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message}</p>}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:translate-y-0 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          Sending... 
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </>
                      ) : (
                        <>Send Message <Send className="w-4 h-4 ml-1" /></>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="mt-8 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
            <div className="rounded-xl overflow-hidden h-64 bg-gray-100">
              <iframe
                title="Google Maps Alanganallur Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31429.03381827191!2d78.06978079489876!3d10.047422963847513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00b7de482bc41b%3A0xd0eec2b7f4c6d676!2sAlanganallur%2C%20Tamil%20Nadu%20625501!5e0!3m2!1sen!2sin!4v1772425251237!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
