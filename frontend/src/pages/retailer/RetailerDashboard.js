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
  FiAlertTriangle, FiMenu, FiX, FiShield, FiUpload
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
      {/* Mobile overlay */}
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
    gstNumber: '',
    panNumber: '',
    shopLicenseNumber: '',
    shopLicenseImage: '',
    gstCertificateImage: '',
    shopFrontPhoto: '',
    aadharNumber: ''
  });

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setShopForm({
          ...shopForm,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString()
        });
        toast.success('Location captured!');
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
      fetchData(); // Refresh shop data to get updated status
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit verification');
    } finally {
      setVerifySubmitting(false);
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
                <button type="button" onClick={getCurrentLocation} className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
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

            {/* Verification Form */}
            {showVerifyForm && (
              <form onSubmit={handleVerifySubmit} className="mt-6 pt-6 border-t border-blue-200 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">GST Number *</label>
                    <input
                      type="text"
                      value={verifyForm.gstNumber}
                      onChange={(e) => setVerifyForm({ ...verifyForm, gstNumber: e.target.value })}
                      className="input-field"
                      placeholder="e.g. 27AABCU9603R1ZM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number</label>
                    <input
                      type="text"
                      value={verifyForm.panNumber}
                      onChange={(e) => setVerifyForm({ ...verifyForm, panNumber: e.target.value })}
                      className="input-field"
                      placeholder="e.g. ABCDE1234F"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Shop License Number</label>
                    <input
                      type="text"
                      value={verifyForm.shopLicenseNumber}
                      onChange={(e) => setVerifyForm({ ...verifyForm, shopLicenseNumber: e.target.value })}
                      className="input-field"
                      placeholder="License number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhar Number</label>
                    <input
                      type="text"
                      value={verifyForm.aadharNumber}
                      onChange={(e) => setVerifyForm({ ...verifyForm, aadharNumber: e.target.value })}
                      className="input-field"
                      placeholder="12-digit Aadhar number"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Shop Front Photo URL *</label>
                    <input
                      type="url"
                      value={verifyForm.shopFrontPhoto}
                      onChange={(e) => setVerifyForm({ ...verifyForm, shopFrontPhoto: e.target.value })}
                      className="input-field"
                      placeholder="https://..."
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">Photo of your actual shop</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">License Image URL</label>
                    <input
                      type="url"
                      value={verifyForm.shopLicenseImage}
                      onChange={(e) => setVerifyForm({ ...verifyForm, shopLicenseImage: e.target.value })}
                      className="input-field"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">GST Certificate URL</label>
                    <input
                      type="url"
                      value={verifyForm.gstCertificateImage}
                      onChange={(e) => setVerifyForm({ ...verifyForm, gstCertificateImage: e.target.value })}
                      className="input-field"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-700">
                    📌 <strong>Note:</strong> At least GST Number or Shop License Number is required. Shop front photo is mandatory.
                    Our team will review your documents within 24-48 hours.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={verifySubmitting}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                >
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
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                ⏳
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Verification Under Review</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your documents have been submitted. Our team is reviewing them. This usually takes 24-48 hours.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Submitted on: {shop?.verification?.submittedAt
                    ? new Date(shop.verification.submittedAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        )}

        {verificationStatus === 'verified' && (
          <div className="card p-5 mb-6 border-green-200 bg-green-50/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                ✅
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Shop Verified!</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your shop is verified. Customers can see the verified badge on your shop.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Verified on: {shop?.verification?.verifiedAt
                    ? new Date(shop.verification.verifiedAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        )}

        {verificationStatus === 'rejected' && (
          <div className="card p-5 mb-6 border-red-200 bg-red-50/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                ❌
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Verification Rejected</h3>
                <p className="text-sm text-red-600 mt-1 font-medium">
                  Reason: {shop?.verification?.rejectionReason || 'No reason provided'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Please fix the issues and resubmit your documents.
                </p>
                <button
                  onClick={() => {
                    setShowVerifyForm(true);
                    // Pre-fill existing data
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

                {/* Show resubmit form */}
                {showVerifyForm && (
                  <form onSubmit={handleVerifySubmit} className="mt-4 pt-4 border-t border-red-200 space-y-4">
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
            <p className="text-sm text-gray-600 mb-3">
              {analytics.lowStockProducts} product(s) have stock below 5 units
            </p>
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