import _asset_1 from "../../assets/videos/about us our story.mp4";
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />

      {/* SECTION 1 - HERO */}
      <section
        className="bg-gradient-to-br from-gray-50 to-orange-50
           overflow-hidden py-20 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className=" grid grid-cols-1 md:grid-cols-2 items-center">
            {/* Left Content */}
            <div className="p-12 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Have no time <br />
                to prepare <span className="text-orange-500">food</span>?
              </h1>

              <p className="text-gray-600 text-lg">
                At Crave Card, we believe food is more than just a meal — it’s
                an experience. From carefully selected ingredients to perfectly
                crafted recipes, every dish is made with love and delivered with
                care. Our mission is simple: bring restaurant-quality flavors
                straight to your doorstep.
              </p>

              <div className="flex items-center gap-6 pt-4">
                <button
                  onClick={() => navigate("/menu")}
                  className="px-8 py-3 bg-orange-500 text-white rounded-full 
                       shadow-lg hover:scale-105 transition duration-300"
                >
                  Taste the Difference
                </button>

                <button
                  onClick={() => {
                    document
                      .getElementById("down")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-gray-600 font-medium hover:text-orange-500 transition"
                >
                  Read More
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-80 md:h-full">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                alt="Delicious Food"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - OUR STORY */}
      <section
        id="down"
        className="py-20 px-4 lg:px-8 bg-gradient-to-br from-gray-50 to-orange-50"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Our <span className="text-orange-500">Story</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2020, FoodOrder began with a simple mission: to
                  connect hungry customers with their favorite local
                  restaurants. What started as a small team of food enthusiasts
                  has grown into a comprehensive food delivery platform serving
                  thousands of customers daily.
                </p>
                <p>
                  We believe that great food should be accessible to everyone,
                  anywhere, anytime. Our platform bridges the gap between
                  amazing local restaurants and food lovers who crave
                  convenience without compromising on quality.
                </p>
                <p>
                  Today, we partner with over 500+ restaurants across multiple
                  cities, ensuring that every order is delivered with the same
                  care and attention to detail that we would expect for
                  ourselves.
                </p>
              </div>
            </div>
            <div className="relative h-96 md:h-full overflow-hidden rounded-3xl">
              <video
                src={_asset_1}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                disablePictureInPicture
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - WHY CHOOSE US */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why <span className="text-orange-500">Choose</span> Us
            </h2>
            <p className="text-gray-600 text-lg">
              We're committed to delivering excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Lightning Fast Delivery
              </h3>
              <p className="text-gray-600">
                Average delivery time of just 30 minutes. We optimize every
                route to ensure your food arrives hot and fresh.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Quality Guaranteed
              </h3>
              <p className="text-gray-600">
                Every restaurant is carefully vetted. We ensure food safety,
                hygiene, and consistent quality across all partners.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                24/7 Customer Support
              </h3>
              <p className="text-gray-600">
                Our dedicated support team is always here to help. Real-time
                assistance for orders, payments, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hygiene & Quality Promise Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <span className="text-orange-500">Hygiene & Quality</span> Promise
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We follow the highest standards to ensure every meal is fresh,
              safe, and full of flavor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-4">🧼</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Sanitized Kitchens
              </h3>
              <p className="text-gray-600 text-sm">
                Our kitchens are cleaned and sanitized multiple times a day to
                ensure complete hygiene.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-4">🥦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Fresh Ingredients
              </h3>
              <p className="text-gray-600 text-sm">
                We source high-quality, fresh ingredients daily from trusted
                suppliers.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-4">🌡️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Temperature Control
              </h3>
              <p className="text-gray-600 text-sm">
                Strict temperature monitoring ensures food safety from
                preparation to delivery.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Safe Packaging
              </h3>
              <p className="text-gray-600 text-sm">
                Every order is sealed securely to maintain freshness and prevent
                contamination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - OUR VALUES */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">
            Our <span className="text-orange-500">Values</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Customer First
              </h3>
              <p className="text-gray-600">
                Every decision we make is centered around providing the best
                possible experience for our customers.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Partnership</h3>
              <p className="text-gray-600">
                We build strong relationships with restaurants, treating them as
                partners in success.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Excellence</h3>
              <p className="text-gray-600">
                We continuously innovate and improve to exceed expectations in
                every aspect of our service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - CALL TO ACTION */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to <span className="text-orange-500">Taste</span> the
            difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who enjoy delicious food
            delivered right to their doorstep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/menu#dishes")}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Explore Menu
            </button>
            <button
              onClick={() => navigate("/menu#categories")}
              className="px-8 py-4 border-2 border-orange-500 text-orange-500 font-bold rounded-full transform transition-all duration-300 hover:bg-orange-500 hover:text-white"
            >
              Browse Categories
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
