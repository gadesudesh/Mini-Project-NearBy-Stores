// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import API from '../../api/axios';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import VerifiedBadge from '../../components/VerifiedBadge';
// import { toast } from 'react-toastify';
// import {
//   FiHome, FiShoppingBag, FiPackage, FiBarChart2,
//   FiPlus, FiMapPin, FiEye, FiMousePointer, FiStar,
//   FiAlertTriangle, FiMenu, FiX, FiShield, FiUpload
// } from 'react-icons/fi';

// const RetailerSidebar = ({ active, sidebarOpen, setSidebarOpen }) => {
//   const links = [
//     { key: 'dashboard', label: 'Dashboard', icon: FiHome, to: '/retailer/dashboard' },
//     { key: 'products', label: 'Products', icon: FiShoppingBag, to: '/retailer/products' },
//     { key: 'inventory', label: 'Inventory', icon: FiPackage, to: '/retailer/inventory' },
//     { key: 'analytics', label: 'Analytics', icon: FiBarChart2, to: '/retailer/analytics' },
//   ];

//   return (
//     <>
//       {/* Mobile overlay */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
//       )}

//       <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//         <div className="p-6 flex items-center justify-between lg:hidden">
//           <span className="font-bold text-gray-900">Menu</span>
//           <button onClick={() => setSidebarOpen(false)}><FiX size={20} /></button>
//         </div>
//         <nav className="p-4 space-y-1">
//           {links.map((link) => (
//             <Link
//               key={link.key}
//               to={link.to}
//               onClick={() => setSidebarOpen(false)}
//               className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
//                 active === link.key
//                   ? 'bg-primary-50 text-primary-600'
//                   : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//               }`}
//             >
//               <link.icon size={18} />
//               {link.label}
//             </Link>
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// };

// const RetailerDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [shop, setShop] = useState(null);
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showShopForm, setShowShopForm] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [shopForm, setShopForm] = useState({
//     shopName: '', description: '', address: '', phone: '',
//     category: 'general', latitude: '', longitude: ''
//   });

//   // ========== VERIFICATION STATE ==========
//   const [showVerifyForm, setShowVerifyForm] = useState(false);
//   const [verifySubmitting, setVerifySubmitting] = useState(false);
//   const [verifyForm, setVerifyForm] = useState({
//     gstNumber: '',
//     panNumber: '',
//     shopLicenseNumber: '',
//     shopLicenseImage: '',
//     gstCertificateImage: '',
//     shopFrontPhoto: '',
//     aadharNumber: ''
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const shopRes = await API.get('/shops/my-shop');
//       setShop(shopRes.data.shop);
//       const analyticsRes = await API.get('/products/analytics/summary');
//       setAnalytics(analyticsRes.data.analytics);
//     } catch (error) {
//       if (error.response?.status === 404) {
//         setShowShopForm(true);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateShop = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post('/shops', shopForm);
//       setShop(res.data.shop);
//       setShowShopForm(false);
//       toast.success('Shop created successfully!');
//       fetchData();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to create shop');
//     }
//   };

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((pos) => {
//         setShopForm({
//           ...shopForm,
//           latitude: pos.coords.latitude.toString(),
//           longitude: pos.coords.longitude.toString()
//         });
//         toast.success('Location captured!');
//       });
//     }
//   };

//   // ========== VERIFICATION SUBMIT ==========
//   const handleVerifySubmit = async (e) => {
//     e.preventDefault();
//     setVerifySubmitting(true);
//     try {
//       const res = await API.post('/shops/verify/submit', verifyForm);
//       toast.success(res.data.message);
//       setShowVerifyForm(false);
//       fetchData(); // Refresh shop data to get updated status
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to submit verification');
//     } finally {
//       setVerifySubmitting(false);
//     }
//   };

//   if (loading) return <LoadingSpinner text="Loading dashboard..." />;

//   // Shop creation form
//   if (showShopForm) {
//     return (
//       <div className="max-w-2xl mx-auto px-4 py-12">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🏪</div>
//           <h1 className="text-2xl font-bold text-gray-900">Set Up Your Shop</h1>
//           <p className="text-gray-500 mt-1">Add your shop details to get started</p>
//         </div>

//         <div className="card p-8">
//           <form onSubmit={handleCreateShop} className="space-y-5">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Name *</label>
//               <input type="text" value={shopForm.shopName} onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })} className="input-field" placeholder="Your shop name" required />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
//               <textarea value={shopForm.description} onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })} className="input-field h-20 resize-none" placeholder="Describe your shop..." />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
//               <input type="text" value={shopForm.address} onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })} className="input-field" placeholder="Full shop address" required />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
//                 <input type="tel" value={shopForm.phone} onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })} className="input-field" placeholder="Shop phone" />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
//                 <select value={shopForm.category} onChange={(e) => setShopForm({ ...shopForm, category: e.target.value })} className="input-field">
//                   {['grocery', 'electronics', 'clothing', 'pharmacy', 'bakery', 'restaurant', 'hardware', 'stationery', 'general', 'other'].map(c => (
//                     <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label className="text-sm font-semibold text-gray-700">Location *</label>
//                 <button type="button" onClick={getCurrentLocation} className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
//                   <FiMapPin size={12} /> Use current location
//                 </button>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <input type="text" value={shopForm.latitude} onChange={(e) => setShopForm({ ...shopForm, latitude: e.target.value })} className="input-field" placeholder="Latitude" required />
//                 <input type="text" value={shopForm.longitude} onChange={(e) => setShopForm({ ...shopForm, longitude: e.target.value })} className="input-field" placeholder="Longitude" required />
//               </div>
//             </div>
//             <button type="submit" className="w-full btn-primary py-3">
//               Create Shop
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   const verificationStatus = shop?.verification?.status || 'unverified';

//   return (
//     <div className="flex min-h-[calc(100vh-64px)]">
//       <RetailerSidebar active="dashboard" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <main className="flex-1 p-4 sm:p-6 lg:p-8">
//         {/* Mobile menu toggle */}
//         <button onClick={() => setSidebarOpen(true)} className="lg:hidden mb-4 p-2 hover:bg-gray-100 rounded-lg">
//           <FiMenu size={20} />
//         </button>

//         <div className="mb-8">
//           <div className="flex items-center gap-3 flex-wrap">
//             <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
//             <VerifiedBadge status={verificationStatus} size="md" />
//           </div>
//           <p className="text-gray-500">{shop?.shopName} — Overview</p>
//         </div>

//         {/* ========== VERIFICATION SECTION ========== */}
//         {verificationStatus === 'unverified' && (
//           <div className="card p-5 mb-6 border-blue-200 bg-blue-50/50">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div className="flex items-start gap-3">
//                 <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
//                   <FiShield className="text-blue-600" size={20} />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-gray-900">Get Your Shop Verified ✅</h3>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Verified shops get a badge that builds customer trust. Submit your GST/License documents to get verified.
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowVerifyForm(!showVerifyForm)}
//                 className="btn-primary flex items-center gap-2 flex-shrink-0"
//               >
//                 <FiUpload size={16} />
//                 {showVerifyForm ? 'Cancel' : 'Start Verification'}
//               </button>
//             </div>

//             {/* Verification Form */}
//             {showVerifyForm && (
//               <form onSubmit={handleVerifySubmit} className="mt-6 pt-6 border-t border-blue-200 space-y-4">
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-1">GST Number *</label>
//                     <input
//                       type="text"
//                       value={verifyForm.gstNumber}
//                       onChange={(e) => setVerifyForm({ ...verifyForm, gstNumber: e.target.value })}
//                       className="input-field"
//                       placeholder="e.g. 27AABCU9603R1ZM"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number</label>
//                     <input
//                       type="text"
//                       value={verifyForm.panNumber}
//                       onChange={(e) => setVerifyForm({ ...verifyForm, panNumber: e.target.value })}
//                       className="input-field"
//                       placeholder="e.g. ABCDE1234F"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-1">Shop License Number</label>
//                     <input
//                       type="text"
//                       value={verifyForm.shopLicenseNumber}
//                       onChange={(e) => setVerifyForm({ ...verifyForm, shopLicenseNumber: e.target.value })}
//                       className="input-field"
//                       placeholder="License number"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhar Number</label>
//                     <input
//                       type="text"
//                       value={verifyForm.aadharNumber}
//                       onChange={(e) => setVerifyForm({ ...verifyForm, aadharNumber: e.target.value })}
//                       className="input-field"
//                       placeholder="12-digit Aadhar number"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid sm:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-1">Shop Front Photo URL *</label>
//                     <input
//                       type="url"
//                       value={verifyForm.shopFrontPhoto}
//                       onChange={(e) => setVerifyForm({ ...verifyForm, shopFrontPhoto: e.target.value })}
//                       className="input-field"
//                       placeholder="https://..."
//                       required
//                     />
//                     <p className="text-xs text-gray-400 mt-1">Photo of your actual shop</p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-1">License Image URL</label>
//                     <input
//                       type="url"
//                       value={verifyForm.shopLicenseImage}
//                       onChange={(e) => setVerifyForm({ ...verifyForm, shopLicenseImage: e.target.value })}
//                       className="input-field"
//                       placeholder="https://..."
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-1">GST Certificate URL</label>
//                     <input
//                       type="url"
//                       value={verifyForm.gstCertificateImage}
//                       onChange={(e) => setVerifyForm({ ...verifyForm, gstCertificateImage: e.target.value })}
//                       className="input-field"
//                       placeholder="https://..."
//                     />
//                   </div>
//                 </div>

//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//                   <p className="text-xs text-yellow-700">
//                     📌 <strong>Note:</strong> At least GST Number or Shop License Number is required. Shop front photo is mandatory.
//                     Our team will review your documents within 24-48 hours.
//                   </p>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={verifySubmitting}
//                   className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
//                 >
//                   <FiShield size={16} />
//                   {verifySubmitting ? 'Submitting...' : 'Submit for Verification'}
//                 </button>
//               </form>
//             )}
//           </div>
//         )}

//         {verificationStatus === 'pending' && (
//           <div className="card p-5 mb-6 border-yellow-200 bg-yellow-50/50">
//             <div className="flex items-start gap-3">
//               <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
//                 ⏳
//               </div>
//               <div>
//                 <h3 className="font-bold text-gray-900">Verification Under Review</h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Your documents have been submitted. Our team is reviewing them. This usually takes 24-48 hours.
//                 </p>
//                 <p className="text-xs text-gray-400 mt-2">
//                   Submitted on: {shop?.verification?.submittedAt
//                     ? new Date(shop.verification.submittedAt).toLocaleDateString('en-IN', {
//                         year: 'numeric', month: 'long', day: 'numeric'
//                       })
//                     : '—'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {verificationStatus === 'verified' && (
//           <div className="card p-5 mb-6 border-green-200 bg-green-50/50">
//             <div className="flex items-start gap-3">
//               <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
//                 ✅
//               </div>
//               <div>
//                 <h3 className="font-bold text-gray-900">Shop Verified!</h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Your shop is verified. Customers can see the verified badge on your shop.
//                 </p>
//                 <p className="text-xs text-gray-400 mt-2">
//                   Verified on: {shop?.verification?.verifiedAt
//                     ? new Date(shop.verification.verifiedAt).toLocaleDateString('en-IN', {
//                         year: 'numeric', month: 'long', day: 'numeric'
//                       })
//                     : '—'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {verificationStatus === 'rejected' && (
//           <div className="card p-5 mb-6 border-red-200 bg-red-50/50">
//             <div className="flex items-start gap-3">
//               <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
//                 ❌
//               </div>
//               <div>
//                 <h3 className="font-bold text-gray-900">Verification Rejected</h3>
//                 <p className="text-sm text-red-600 mt-1 font-medium">
//                   Reason: {shop?.verification?.rejectionReason || 'No reason provided'}
//                 </p>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Please fix the issues and resubmit your documents.
//                 </p>
//                 <button
//                   onClick={() => {
//                     setShowVerifyForm(true);
//                     // Pre-fill existing data
//                     setVerifyForm({
//                       gstNumber: shop?.verification?.gstNumber || '',
//                       panNumber: shop?.verification?.panNumber || '',
//                       shopLicenseNumber: shop?.verification?.shopLicenseNumber || '',
//                       shopLicenseImage: shop?.verification?.shopLicenseImage || '',
//                       gstCertificateImage: shop?.verification?.gstCertificateImage || '',
//                       shopFrontPhoto: shop?.verification?.shopFrontPhoto || '',
//                       aadharNumber: shop?.verification?.aadharNumber || '',
//                     });
//                   }}
//                   className="mt-3 btn-primary py-2 px-4 text-sm flex items-center gap-2"
//                 >
//                   <FiUpload size={14} /> Resubmit Documents
//                 </button>

//                 {/* Show resubmit form */}
//                 {showVerifyForm && (
//                   <form onSubmit={handleVerifySubmit} className="mt-4 pt-4 border-t border-red-200 space-y-4">
//                     <div className="grid sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">GST Number *</label>
//                         <input type="text" value={verifyForm.gstNumber} onChange={(e) => setVerifyForm({ ...verifyForm, gstNumber: e.target.value })} className="input-field" placeholder="e.g. 27AABCU9603R1ZM" />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number</label>
//                         <input type="text" value={verifyForm.panNumber} onChange={(e) => setVerifyForm({ ...verifyForm, panNumber: e.target.value })} className="input-field" placeholder="e.g. ABCDE1234F" />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">Shop License Number</label>
//                         <input type="text" value={verifyForm.shopLicenseNumber} onChange={(e) => setVerifyForm({ ...verifyForm, shopLicenseNumber: e.target.value })} className="input-field" />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhar Number</label>
//                         <input type="text" value={verifyForm.aadharNumber} onChange={(e) => setVerifyForm({ ...verifyForm, aadharNumber: e.target.value })} className="input-field" />
//                       </div>
//                     </div>
//                     <div className="grid sm:grid-cols-3 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">Shop Front Photo *</label>
//                         <input type="url" value={verifyForm.shopFrontPhoto} onChange={(e) => setVerifyForm({ ...verifyForm, shopFrontPhoto: e.target.value })} className="input-field" required />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">License Image</label>
//                         <input type="url" value={verifyForm.shopLicenseImage} onChange={(e) => setVerifyForm({ ...verifyForm, shopLicenseImage: e.target.value })} className="input-field" />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1">GST Certificate</label>
//                         <input type="url" value={verifyForm.gstCertificateImage} onChange={(e) => setVerifyForm({ ...verifyForm, gstCertificateImage: e.target.value })} className="input-field" />
//                       </div>
//                     </div>
//                     <button type="submit" disabled={verifySubmitting} className="btn-primary py-2.5 flex items-center gap-2 disabled:opacity-50">
//                       <FiShield size={16} /> {verifySubmitting ? 'Submitting...' : 'Resubmit for Verification'}
//                     </button>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Stats */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           {[
//             { label: 'Total Products', value: analytics?.totalProducts || 0, icon: FiShoppingBag, color: 'bg-blue-50 text-blue-600' },
//             { label: 'Total Views', value: analytics?.totalViews || 0, icon: FiEye, color: 'bg-green-50 text-green-600' },
//             { label: 'Clicks', value: analytics?.totalClicks || 0, icon: FiMousePointer, color: 'bg-purple-50 text-purple-600' },
//             { label: 'Avg Rating', value: analytics?.averageRating || '—', icon: FiStar, color: 'bg-yellow-50 text-yellow-600' },
//           ].map((stat, i) => (
//             <div key={i} className="card p-5">
//               <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
//                 <stat.icon size={18} />
//               </div>
//               <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//               <p className="text-sm text-gray-500">{stat.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Quick actions */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//           <button onClick={() => navigate('/retailer/products')} className="card p-5 text-left hover:border-primary-200 group">
//             <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
//               <FiPlus className="text-primary-600" size={18} />
//             </div>
//             <h3 className="font-bold text-gray-900">Add Product</h3>
//             <p className="text-sm text-gray-500">Add new products to your listing</p>
//           </button>
//           <button onClick={() => navigate('/retailer/inventory')} className="card p-5 text-left hover:border-primary-200 group">
//             <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
//               <FiPackage className="text-orange-600" size={18} />
//             </div>
//             <h3 className="font-bold text-gray-900">Manage Inventory</h3>
//             <p className="text-sm text-gray-500">Update stock and prices</p>
//           </button>
//           <button onClick={() => navigate('/retailer/analytics')} className="card p-5 text-left hover:border-primary-200 group">
//             <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
//               <FiBarChart2 className="text-green-600" size={18} />
//             </div>
//             <h3 className="font-bold text-gray-900">View Analytics</h3>
//             <p className="text-sm text-gray-500">Track your performance</p>
//           </button>
//         </div>

//         {/* Low stock alert */}
//         {analytics?.lowStockProducts > 0 && (
//           <div className="card p-5 border-orange-200 bg-orange-50/50">
//             <div className="flex items-center gap-3 mb-3">
//               <FiAlertTriangle className="text-orange-500" size={20} />
//               <h3 className="font-bold text-gray-900">Low Stock Alert</h3>
//             </div>
//             <p className="text-sm text-gray-600 mb-3">
//               {analytics.lowStockProducts} product(s) have stock below 5 units
//             </p>
//             <div className="space-y-2">
//               {analytics.lowStockItems?.map((item) => (
//                 <div key={item._id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2">
//                   <span className="text-sm font-medium text-gray-700">{item.productName}</span>
//                   <span className="text-sm font-bold text-orange-600">{item.stock} left</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export { RetailerSidebar };
// export default RetailerDashboard;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import VerifiedBadge from '../../components/VerifiedBadge';
import { toast } from 'react-toastify';
import {
  FiHome, FiShoppingBag, FiPackage, FiBarChart2,
  FiPlus, FiMapPin, FiEye, FiMousePointer, FiStar,
  FiAlertTriangle, FiMenu, FiX, FiShield, FiUpload,
  FiCamera, FiTrash2, FiEdit3, FiSave, FiPhone, FiImage
} from 'react-icons/fi';

const RetailerSidebar = ({ active, sidebarOpen, setSidebarOpen }) => {
  const links = [
    { key: 'dashboard', label: 'Dashboard', icon: FiHome, to: '/retailer/dashboard' },
    { key: 'products', label: 'Products', icon: FiShoppingBag, to: '/retailer/products' },
    { key: 'inventory', label: 'Inventory', icon: FiPackage, to: '/retailer/inventory' },
    { key: 'analytics', label: 'Analytics', icon: FiBarChart2, to: '/retailer/analytics' },
  ];

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between lg:hidden">
          <span className="font-bold text-gray-900">Menu</span>
          <button onClick={() => setSidebarOpen(false)}><FiX size={20} /></button>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active === link.key
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

const RetailerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShopForm, setShowShopForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shopForm, setShopForm] = useState({
    shopName: '', description: '', address: '', phone: '',
    category: 'general', latitude: '', longitude: ''
  });

  // ========== VERIFICATION STATE ==========
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [verifySubmitting, setVerifySubmitting] = useState(false);
  const [verifyForm, setVerifyForm] = useState({
    gstNumber: '', panNumber: '', shopLicenseNumber: '',
    shopLicenseImage: '', gstCertificateImage: '', shopFrontPhoto: '', aadharNumber: ''
  });

  // ✅ NEW: EDIT SHOP STATE
  const [showEditShop, setShowEditShop] = useState(false);
  const [editForm, setEditForm] = useState({
    shopName: '', description: '', address: '', phone: '',
    category: 'general', latitude: '', longitude: '', image: ''
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // ✅ NEW: PHOTOS STATE
  const [showPhotos, setShowPhotos] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoSubmitting, setPhotoSubmitting] = useState(false);

  // ✅ NEW: DELETE SHOP STATE
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTyped, setDeleteTyped] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const shopRes = await API.get('/shops/my-shop');
      setShop(shopRes.data.shop);
      const analyticsRes = await API.get('/products/analytics/summary');
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      if (error.response?.status === 404) {
        setShowShopForm(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShop = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/shops', shopForm);
      setShop(res.data.shop);
      setShowShopForm(false);
      toast.success('Shop created successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shop');
    }
  };

  const getCurrentLocation = (formSetter, form) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        formSetter({
          ...form,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString()
        });
        toast.success('Location captured!');
      }, () => {
        toast.error('Location access denied');
      });
    }
  };

  // ========== VERIFICATION SUBMIT ==========
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setVerifySubmitting(true);
    try {
      const res = await API.post('/shops/verify/submit', verifyForm);
      toast.success(res.data.message);
      setShowVerifyForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit verification');
    } finally {
      setVerifySubmitting(false);
    }
  };

  // ✅ NEW: EDIT SHOP HANDLER
  const handleEditShop = () => {
    setEditForm({
      shopName: shop.shopName || '',
      description: shop.description || '',
      address: shop.address || '',
      phone: shop.phone || '',
      category: shop.category || 'general',
      latitude: shop.location?.coordinates?.[1]?.toString() || '',
      longitude: shop.location?.coordinates?.[0]?.toString() || '',
      image: shop.image || ''
    });
    setShowEditShop(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      const res = await API.put(`/shops/${shop._id}`, editForm);
      setShop(res.data.shop);
      setShowEditShop(false);
      toast.success('Shop updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update shop');
    } finally {
      setEditSubmitting(false);
    }
  };

  // ✅ NEW: ADD PHOTO HANDLER
  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!photoUrl.trim()) return toast.error('Enter a photo URL');
    setPhotoSubmitting(true);
    try {
      const res = await API.post('/shops/photos', { url: photoUrl, caption: photoCaption });
      setShop({ ...shop, photos: res.data.photos });
      setPhotoUrl('');
      setPhotoCaption('');
      toast.success('Photo added!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add photo');
    } finally {
      setPhotoSubmitting(false);
    }
  };

  // ✅ NEW: DELETE PHOTO HANDLER
  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      const res = await API.delete(`/shops/photos/${photoId}`);
      setShop({ ...shop, photos: res.data.photos });
      toast.success('Photo deleted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete photo');
    }
  };

  // ✅ NEW: DELETE SHOP HANDLER
  const handleDeleteShop = async () => {
    if (deleteTyped !== 'DELETE') return toast.error('Type DELETE to confirm');
    setDeleting(true);
    try {
      await API.delete(`/shops/${shop._id}`);
      toast.success('Shop deleted successfully');
      setShop(null);
      setShowDeleteConfirm(false);
      setShowShopForm(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete shop');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  // Shop creation form
  if (showShopForm) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🏪</div>
          <h1 className="text-2xl font-bold text-gray-900">Set Up Your Shop</h1>
          <p className="text-gray-500 mt-1">Add your shop details to get started</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleCreateShop} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Name *</label>
              <input type="text" value={shopForm.shopName} onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })} className="input-field" placeholder="Your shop name" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea value={shopForm.description} onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })} className="input-field h-20 resize-none" placeholder="Describe your shop..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
              <input type="text" value={shopForm.address} onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })} className="input-field" placeholder="Full shop address" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input type="tel" value={shopForm.phone} onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })} className="input-field" placeholder="Shop phone" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select value={shopForm.category} onChange={(e) => setShopForm({ ...shopForm, category: e.target.value })} className="input-field">
                  {['grocery', 'electronics', 'clothing', 'pharmacy', 'bakery', 'restaurant', 'hardware', 'stationery', 'general', 'other'].map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Location *</label>
                <button type="button" onClick={() => getCurrentLocation(setShopForm, shopForm)} className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
                  <FiMapPin size={12} /> Use current location
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={shopForm.latitude} onChange={(e) => setShopForm({ ...shopForm, latitude: e.target.value })} className="input-field" placeholder="Latitude" required />
                <input type="text" value={shopForm.longitude} onChange={(e) => setShopForm({ ...shopForm, longitude: e.target.value })} className="input-field" placeholder="Longitude" required />
              </div>
            </div>
            <button type="submit" className="w-full btn-primary py-3">
              Create Shop
            </button>
          </form>
        </div>
      </div>
    );
  }

  const verificationStatus = shop?.verification?.status || 'unverified';

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <RetailerSidebar active="dashboard" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Mobile menu toggle */}
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden mb-4 p-2 hover:bg-gray-100 rounded-lg">
          <FiMenu size={20} />
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <VerifiedBadge status={verificationStatus} size="md" />
          </div>
          <p className="text-gray-500">{shop?.shopName} — Overview</p>
        </div>

        {/* ========== SHOP MANAGEMENT SECTION ========== */}
        <div className="card p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              {shop?.image ? (
                <img src={shop.image} alt={shop.shopName} className="w-14 h-14 rounded-xl object-cover" />
              ) : (
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-2xl">🏪</div>
              )}
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{shop?.shopName}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <FiMapPin size={12} /> {shop?.address}
                </p>
                {shop?.phone && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FiPhone size={12} /> {shop.phone}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleEditShop} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                <FiEdit3 size={14} /> Edit Shop
              </button>
              <button onClick={() => setShowPhotos(!showPhotos)} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors">
                <FiCamera size={14} /> Photos ({shop?.photos?.length || 0})
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                <FiTrash2 size={14} /> Delete Shop
              </button>
            </div>
          </div>

          {/* ✅ EDIT SHOP FORM */}
          {showEditShop && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiEdit3 size={16} /> Edit Shop Details
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Shop Name *</label>
                    <input type="text" value={editForm.shopName} onChange={(e) => setEditForm({ ...editForm, shopName: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="input-field h-20 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address *</label>
                  <input type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="input-field" required />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="input-field">
                      {['grocery', 'electronics', 'clothing', 'pharmacy', 'bakery', 'restaurant', 'hardware', 'stationery', 'home_appliances', 'sports', 'accessories', 'personal_care', 'fitness', 'general', 'other'].map(c => (
                        <option key={c} value={c}>{c.replace('_', ' ').charAt(0).toUpperCase() + c.replace('_', ' ').slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Shop Image URL</label>
                    <input type="url" value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} className="input-field" placeholder="https://..." />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-gray-700">Location (Address Coordinates)</label>
                    <button type="button" onClick={() => getCurrentLocation(setEditForm, editForm)} className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
                      <FiMapPin size={12} /> Use current location
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" value={editForm.latitude} onChange={(e) => setEditForm({ ...editForm, latitude: e.target.value })} className="input-field" placeholder="Latitude" />
                    <input type="text" value={editForm.longitude} onChange={(e) => setEditForm({ ...editForm, longitude: e.target.value })} className="input-field" placeholder="Longitude" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">💡 Update coordinates when you change address so map & directions stay accurate.</p>
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={editSubmitting} className="btn-primary py-2.5 flex items-center gap-2 disabled:opacity-50">
                    <FiSave size={14} /> {editSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setShowEditShop(false)} className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ✅ SHOP PHOTOS SECTION */}
          {showPhotos && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCamera size={16} /> Shop Photos
              </h3>

              {/* Add Photo Form */}
              <form onSubmit={handleAddPhoto} className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Photo URL (https://...)"
                  required
                />
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="input-field sm:w-48"
                  placeholder="Caption (optional)"
                />
                <button type="submit" disabled={photoSubmitting} className="btn-primary px-4 py-2.5 flex items-center gap-2 flex-shrink-0 disabled:opacity-50">
                  <FiPlus size={14} /> {photoSubmitting ? 'Adding...' : 'Add Photo'}
                </button>
              </form>

              {/* Photos Grid */}
              {shop?.photos?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {shop.photos.map((photo) => (
                    <div key={photo._id} className="relative group rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Shop photo'}
                        className="w-full h-32 object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/200x150?text=Photo'; }}
                      />
                      {/* Delete overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <button
                          onClick={() => handleDeletePhoto(photo._id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                          <p className="text-xs text-white truncate">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <FiImage className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-sm text-gray-400">No photos yet. Add your shop photos above!</p>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">📷 Max 10 photos. Use image hosting sites like Imgur, Cloudinary, etc.</p>
            </div>
          )}

          {/* ✅ DELETE SHOP CONFIRMATION */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <div className="text-center mb-4">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">🗑️</div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Your Shop?</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    This will permanently delete your shop, <strong>all products</strong>, and <strong>all reviews</strong>. This action cannot be undone.
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type <span className="text-red-600 font-mono">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteTyped}
                    onChange={(e) => setDeleteTyped(e.target.value)}
                    className="input-field text-center font-mono tracking-widest"
                    placeholder="DELETE"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowDeleteConfirm(false); setDeleteTyped(''); }}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteShop}
                    disabled={deleteTyped !== 'DELETE' || deleting}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FiTrash2 size={14} /> {deleting ? 'Deleting...' : 'Delete Forever'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========== VERIFICATION SECTION ========== */}
        {verificationStatus === 'unverified' && (
          <div className="card p-5 mb-6 border-blue-200 bg-blue-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiShield className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Get Your Shop Verified ✅</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Verified shops get a badge that builds customer trust. Submit your GST/License documents to get verified.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVerifyForm(!showVerifyForm)}
                className="btn-primary flex items-center gap-2 flex-shrink-0"
              >
                <FiUpload size={16} />
                {showVerifyForm ? 'Cancel' : 'Start Verification'}
              </button>
            </div>

            {showVerifyForm && (
              <form onSubmit={handleVerifySubmit} className="mt-6 pt-6 border-t border-blue-200 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">GST Number *</label>
                    <input type="text" value={verifyForm.gstNumber} onChange={(e) => setVerifyForm({ ...verifyForm, gstNumber: e.target.value })} className="input-field" placeholder="e.g. 27AABCU9603R1ZM" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number</label>
                    <input type="text" value={verifyForm.panNumber} onChange={(e) => setVerifyForm({ ...verifyForm, panNumber: e.target.value })} className="input-field" placeholder="e.g. ABCDE1234F" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Shop License Number</label>
                    <input type="text" value={verifyForm.shopLicenseNumber} onChange={(e) => setVerifyForm({ ...verifyForm, shopLicenseNumber: e.target.value })} className="input-field" placeholder="License number" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhar Number</label>
                    <input type="text" value={verifyForm.aadharNumber} onChange={(e) => setVerifyForm({ ...verifyForm, aadharNumber: e.target.value })} className="input-field" placeholder="12-digit Aadhar number" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Shop Front Photo URL *</label>
                    <input type="url" value={verifyForm.shopFrontPhoto} onChange={(e) => setVerifyForm({ ...verifyForm, shopFrontPhoto: e.target.value })} className="input-field" placeholder="https://..." required />
                    <p className="text-xs text-gray-400 mt-1">Photo of your actual shop</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">License Image URL</label>
                    <input type="url" value={verifyForm.shopLicenseImage} onChange={(e) => setVerifyForm({ ...verifyForm, shopLicenseImage: e.target.value })} className="input-field" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">GST Certificate URL</label>
                    <input type="url" value={verifyForm.gstCertificateImage} onChange={(e) => setVerifyForm({ ...verifyForm, gstCertificateImage: e.target.value })} className="input-field" placeholder="https://..." />
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-700">
                    📌 <strong>Note:</strong> At least GST Number or Shop License Number is required. Shop front photo is mandatory.
                    Our team will review your documents within 24-48 hours.
                  </p>
                </div>
                <button type="submit" disabled={verifySubmitting} className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                  <FiShield size={16} />
                  {verifySubmitting ? 'Submitting...' : 'Submit for Verification'}
                </button>
              </form>
            )}
          </div>
        )}

        {verificationStatus === 'pending' && (
          <div className="card p-5 mb-6 border-yellow-200 bg-yellow-50/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">⏳</div>
              <div>
                <h3 className="font-bold text-gray-900">Verification Under Review</h3>
                <p className="text-sm text-gray-600 mt-1">Your documents have been submitted. Our team is reviewing them. This usually takes 24-48 hours.</p>
                <p className="text-xs text-gray-400 mt-2">
                  Submitted on: {shop?.verification?.submittedAt ? new Date(shop.verification.submittedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                </p>
              </div>
            </div>
          </div>
        )}

        {verificationStatus === 'verified' && (
          <div className="card p-5 mb-6 border-green-200 bg-green-50/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">✅</div>
              <div>
                <h3 className="font-bold text-gray-900">Shop Verified!</h3>
                <p className="text-sm text-gray-600 mt-1">Your shop is verified. Customers can see the verified badge on your shop.</p>
                <p className="text-xs text-gray-400 mt-2">
                  Verified on: {shop?.verification?.verifiedAt ? new Date(shop.verification.verifiedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                </p>
              </div>
            </div>
          </div>
        )}

        {verificationStatus === 'rejected' && (
          <div className="card p-5 mb-6 border-red-200 bg-red-50/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">❌</div>
              <div>
                <h3 className="font-bold text-gray-900">Verification Rejected</h3>
                <p className="text-sm text-red-600 mt-1 font-medium">Reason: {shop?.verification?.rejectionReason || 'No reason provided'}</p>
                <p className="text-sm text-gray-600 mt-1">Please fix the issues and resubmit your documents.</p>
                <button
                  onClick={() => {
                    setShowVerifyForm(true);
                    setVerifyForm({
                      gstNumber: shop?.verification?.gstNumber || '',
                      panNumber: shop?.verification?.panNumber || '',
                      shopLicenseNumber: shop?.verification?.shopLicenseNumber || '',
                      shopLicenseImage: shop?.verification?.shopLicenseImage || '',
                      gstCertificateImage: shop?.verification?.gstCertificateImage || '',
                      shopFrontPhoto: shop?.verification?.shopFrontPhoto || '',
                      aadharNumber: shop?.verification?.aadharNumber || '',
                    });
                  }}
                  className="mt-3 btn-primary py-2 px-4 text-sm flex items-center gap-2"
                >
                  <FiUpload size={14} /> Resubmit Documents
                </button>

                {showVerifyForm && (
                  <form onSubmit={handleVerifySubmit} className="mt-4 pt-4 border-t border-red-200 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">GST Number *</label>
                        <input type="text" value={verifyForm.gstNumber} onChange={(e) => setVerifyForm({ ...verifyForm, gstNumber: e.target.value })} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number</label>
                        <input type="text" value={verifyForm.panNumber} onChange={(e) => setVerifyForm({ ...verifyForm, panNumber: e.target.value })} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Shop License Number</label>
                        <input type="text" value={verifyForm.shopLicenseNumber} onChange={(e) => setVerifyForm({ ...verifyForm, shopLicenseNumber: e.target.value })} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhar Number</label>
                        <input type="text" value={verifyForm.aadharNumber} onChange={(e) => setVerifyForm({ ...verifyForm, aadharNumber: e.target.value })} className="input-field" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Shop Front Photo *</label>
                        <input type="url" value={verifyForm.shopFrontPhoto} onChange={(e) => setVerifyForm({ ...verifyForm, shopFrontPhoto: e.target.value })} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">License Image</label>
                        <input type="url" value={verifyForm.shopLicenseImage} onChange={(e) => setVerifyForm({ ...verifyForm, shopLicenseImage: e.target.value })} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">GST Certificate</label>
                        <input type="url" value={verifyForm.gstCertificateImage} onChange={(e) => setVerifyForm({ ...verifyForm, gstCertificateImage: e.target.value })} className="input-field" />
                      </div>
                    </div>
                    <button type="submit" disabled={verifySubmitting} className="btn-primary py-2.5 flex items-center gap-2 disabled:opacity-50">
                      <FiShield size={16} /> {verifySubmitting ? 'Submitting...' : 'Resubmit for Verification'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: analytics?.totalProducts || 0, icon: FiShoppingBag, color: 'bg-blue-50 text-blue-600' },
            { label: 'Total Views', value: analytics?.totalViews || 0, icon: FiEye, color: 'bg-green-50 text-green-600' },
            { label: 'Clicks', value: analytics?.totalClicks || 0, icon: FiMousePointer, color: 'bg-purple-50 text-purple-600' },
            { label: 'Avg Rating', value: analytics?.averageRating || '—', icon: FiStar, color: 'bg-yellow-50 text-yellow-600' },
          ].map((stat, i) => (
            <div key={i} className="card p-5">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button onClick={() => navigate('/retailer/products')} className="card p-5 text-left hover:border-primary-200 group">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FiPlus className="text-primary-600" size={18} />
            </div>
            <h3 className="font-bold text-gray-900">Add Product</h3>
            <p className="text-sm text-gray-500">Add new products to your listing</p>
          </button>
          <button onClick={() => navigate('/retailer/inventory')} className="card p-5 text-left hover:border-primary-200 group">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FiPackage className="text-orange-600" size={18} />
            </div>
            <h3 className="font-bold text-gray-900">Manage Inventory</h3>
            <p className="text-sm text-gray-500">Update stock and prices</p>
          </button>
          <button onClick={() => navigate('/retailer/analytics')} className="card p-5 text-left hover:border-primary-200 group">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FiBarChart2 className="text-green-600" size={18} />
            </div>
            <h3 className="font-bold text-gray-900">View Analytics</h3>
            <p className="text-sm text-gray-500">Track your performance</p>
          </button>
        </div>

        {/* Low stock alert */}
        {analytics?.lowStockProducts > 0 && (
          <div className="card p-5 border-orange-200 bg-orange-50/50">
            <div className="flex items-center gap-3 mb-3">
              <FiAlertTriangle className="text-orange-500" size={20} />
              <h3 className="font-bold text-gray-900">Low Stock Alert</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{analytics.lowStockProducts} product(s) have stock below 5 units</p>
            <div className="space-y-2">
              {analytics.lowStockItems?.map((item) => (
                <div key={item._id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2">
                  <span className="text-sm font-medium text-gray-700">{item.productName}</span>
                  <span className="text-sm font-bold text-orange-600">{item.stock} left</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export { RetailerSidebar };
export default RetailerDashboard;