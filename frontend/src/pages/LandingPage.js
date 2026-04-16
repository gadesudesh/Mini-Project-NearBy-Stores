// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FiMapPin, FiSearch, FiShoppingBag, FiStar, FiArrowRight, FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi';

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen">
//       {/* Hero */}
//       <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
//           <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
//         </div>

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
//           <div className="max-w-3xl">
//             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
//               <FiMapPin size={16} />
//               <span className="text-sm font-medium">Discover local shops near you</span>
//             </div>
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
//               Find The Best Deals
//               <br />
//               <span className="text-blue-200">At Nearby Stores</span>
//             </h1>
//             <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
//               Compare prices, discover local shops, and support your community. 
//               The smartest way to shop locally and save money.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Link to="/signup?role=customer" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-bold py-3.5 px-8 rounded-xl hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]">
//                 <FiSearch size={20} />
//                 I'm a Customer
//                 <FiArrowRight size={16} />
//               </Link>
//               <Link to="/signup?role=retailer" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold py-3.5 px-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all active:scale-[0.98]">
//                 <FiShoppingBag size={20} />
//                 I'm a Shop Owner
//                 <FiArrowRight size={16} />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//               How It Works
//             </h2>
//             <p className="text-gray-500 text-lg max-w-2xl mx-auto">
//               Connecting local businesses with nearby customers in three simple steps
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { icon: FiSearch, title: 'Search Products', desc: 'Search for any product you need. We\'ll find it at shops near your location.', color: 'bg-blue-50 text-blue-600', step: '01' },
//               { icon: FiMapPin, title: 'Compare Nearby', desc: 'See which nearby shops sell your product, compare prices, and read reviews.', color: 'bg-green-50 text-green-600', step: '02' },
//               { icon: FiStar, title: 'Shop & Review', desc: 'Visit the best shop, get your product, and leave a review to help others.', color: 'bg-orange-50 text-orange-600', step: '03' },
//             ].map((feature, i) => (
//               <div key={i} className="card p-8 hover:border-primary-200 group">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
//                     <feature.icon size={24} />
//                   </div>
//                   <span className="text-4xl font-bold text-gray-100">{feature.step}</span>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
//                 <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* For Retailers */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-16 items-center">
//             <div>
//               <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 rounded-full px-4 py-2 mb-6">
//                 <FiShoppingBag size={16} />
//                 <span className="text-sm font-bold">For Shop Owners</span>
//               </div>
//               <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
//                 Grow Your Local Business Online
//               </h2>
//               <p className="text-gray-500 text-lg mb-8 leading-relaxed">
//                 List your products, manage inventory, and reach more customers in your area — all from a simple dashboard designed for ease of use.
//               </p>
//               <div className="space-y-4">
//                 {[
//                   { icon: FiShield, text: 'Easy product management with real-time updates' },
//                   { icon: FiTrendingUp, text: 'Analytics to track views, clicks, and performance' },
//                   { icon: FiUsers, text: 'Reach customers searching for products near you' },
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                       <item.icon className="text-accent-500" size={18} />
//                     </div>
//                     <span className="text-gray-700 font-medium">{item.text}</span>
//                   </div>
//                 ))}
//               </div>
//               <Link to="/signup?role=retailer" className="inline-flex items-center gap-2 btn-primary mt-8">
//                 Register Your Shop <FiArrowRight />
//               </Link>
//             </div>
//             <div className="relative">
//               <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
//                     <FiShoppingBag className="text-white" size={18} />
//                   </div>
//                   <div>
//                     <p className="font-bold text-gray-900">Retailer Dashboard</p>
//                     <p className="text-xs text-gray-500">Manage everything in one place</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   {[
//                     { label: 'Products', value: '48', color: 'bg-blue-50 text-blue-600' },
//                     { label: 'Views Today', value: '234', color: 'bg-green-50 text-green-600' },
//                     { label: 'Rating', value: '4.8★', color: 'bg-yellow-50 text-yellow-600' },
//                     { label: 'Revenue', value: '₹12.5K', color: 'bg-purple-50 text-purple-600' },
//                   ].map((stat, i) => (
//                     <div key={i} className={`${stat.color} rounded-xl p-4`}>
//                       <p className="text-2xl font-bold">{stat.value}</p>
//                       <p className="text-sm opacity-75">{stat.label}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-gray-400 py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="flex items-center gap-2 mb-4 md:mb-0">
//               <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
//                 <FiMapPin className="text-white" size={16} />
//               </div>
//               <span className="text-white font-bold text-lg">Near By Store</span>
//             </div>
//             <p className="text-sm">© 2024 Near By Store. Connecting communities, one shop at a time.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiSearch, FiShoppingBag, FiStar, FiArrowRight, FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <FiMapPin size={16} />
              <span className="text-sm font-medium">Discover local shops near you</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Find The Best Deals
              <br />
              <span className="text-blue-200">At Nearby Stores</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
              Compare prices, discover local shops, and support your community. 
              The smartest way to shop locally and save money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup?role=customer" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-bold py-3.5 px-8 rounded-xl hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]">
                <FiSearch size={20} />
                I'm a Customer
                <FiArrowRight size={16} />
              </Link>
              <Link to="/signup?role=retailer" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold py-3.5 px-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all active:scale-[0.98]">
                <FiShoppingBag size={20} />
                I'm a Shop Owner
                <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Connecting local businesses with nearby customers in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FiSearch, title: 'Search Products', desc: 'Search for any product you need. We\'ll find it at shops near your location.', color: 'bg-blue-50 text-blue-600', step: '01' },
              { icon: FiMapPin, title: 'Compare Nearby', desc: 'See which nearby shops sell your product, compare prices, and read reviews.', color: 'bg-green-50 text-green-600', step: '02' },
              { icon: FiStar, title: 'Shop & Review', desc: 'Visit the best shop, get your product, and leave a review to help others.', color: 'bg-orange-50 text-orange-600', step: '03' },
            ].map((feature, i) => (
              <div key={i} className="card p-8 hover:border-primary-200 group">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon size={24} />
                  </div>
                  <span className="text-4xl font-bold text-gray-100">{feature.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Retailers */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 rounded-full px-4 py-2 mb-6">
                <FiShoppingBag size={16} />
                <span className="text-sm font-bold">For Shop Owners</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Grow Your Local Business Online
              </h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                List your products, manage inventory, and reach more customers in your area — all from a simple dashboard designed for ease of use.
              </p>
              <div className="space-y-4">
                {[
                  { icon: FiShield, text: 'Easy product management with real-time updates' },
                  { icon: FiTrendingUp, text: 'Analytics to track views, clicks, and performance' },
                  { icon: FiUsers, text: 'Reach customers searching for products near you' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-accent-500" size={18} />
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/signup?role=retailer" className="inline-flex items-center gap-2 btn-primary mt-8">
                Register Your Shop <FiArrowRight />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                    <FiShoppingBag className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Retailer Dashboard</p>
                    <p className="text-xs text-gray-500">Manage everything in one place</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Products', value: '48', color: 'bg-blue-50 text-blue-600' },
                    { label: 'Views Today', value: '234', color: 'bg-green-50 text-green-600' },
                    { label: 'Rating', value: '4.8★', color: 'bg-yellow-50 text-yellow-600' },
                    { label: 'Interested Customers', value: '85', color: 'bg-purple-50 text-purple-600' },
                  ].map((stat, i) => (
                    <div key={i} className={`${stat.color} rounded-xl p-4`}>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm opacity-75">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FiMapPin className="text-white" size={16} />
              </div>
              <span className="text-white font-bold text-lg">Near By Store</span>
            </div>
            <p className="text-sm">© 2024 Near By Store. Connecting communities, one shop at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;