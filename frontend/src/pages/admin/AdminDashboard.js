import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import VerifiedBadge from '../../components/VerifiedBadge';
import { toast } from 'react-toastify';
import { FiCheck, FiX, FiEye, FiShield, FiClock, FiAlertTriangle } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedShop, setSelectedShop] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchShops();
  }, [filter]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/shops/admin/all?status=${filter}`);
      setShops(res.data.shops);
      setCounts(res.data.counts);
    } catch (err) {
      toast.error('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (shopId, action) => {
    if (action === 'reject' && !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setProcessing(true);
    try {
      await API.put(`/shops/admin/verify/${shopId}`, {
        action,
        rejectionReason: action === 'reject' ? rejectionReason : '',
        adminNotes,
      });
      toast.success(`Shop ${action === 'approve' ? 'approved ✅' : 'rejected ❌'}`);
      setSelectedShop(null);
      setRejectionReason('');
      setAdminNotes('');
      fetchShops();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(false);
    }
  };

  const filterTabs = [
    { key: 'pending', label: 'Pending', count: counts.pending, icon: FiClock, color: 'text-yellow-600' },
    { key: 'verified', label: 'Verified', count: counts.verified, icon: FiCheck, color: 'text-green-600' },
    { key: 'rejected', label: 'Rejected', count: counts.rejected, icon: FiX, color: 'text-red-600' },
    { key: 'unverified', label: 'Unverified', count: counts.unverified, icon: FiAlertTriangle, color: 'text-gray-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FiShield className="text-primary-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Admin — Shop Verification</h1>
        </div>
        <p className="text-gray-500">Review and verify shop registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-2xl font-bold text-gray-900">{counts.total || 0}</p>
          <p className="text-sm text-gray-500">Total Shops</p>
        </div>
        {filterTabs.map((tab) => (
          <div key={tab.key} className="card p-4">
            <p className={`text-2xl font-bold ${tab.color}`}>{tab.count || 0}</p>
            <p className="text-sm text-gray-500">{tab.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.count > 0 && (
              <span className="bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Shops List */}
      {loading ? (
        <LoadingSpinner />
      ) : shops.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500">No {filter} shops found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shops.map((shop) => (
            <div key={shop._id} className="card p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Shop Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  {shop.image ? (
                    <img src={shop.image} alt={shop.shopName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xl">🏪</div>
                  )}
                </div>

                {/* Shop Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{shop.shopName}</h3>
                    <VerifiedBadge status={shop.verification?.status} />
                  </div>
                  <p className="text-sm text-gray-500">{shop.address}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Owner: {shop.owner?.name} ({shop.owner?.email}) • {shop.owner?.phone}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setSelectedShop(selectedShop?._id === shop._id ? null : shop)}
                    className="btn-secondary py-2 px-3 text-sm flex items-center gap-1"
                  >
                    <FiEye size={14} />
                    {selectedShop?._id === shop._id ? 'Hide' : 'Review'}
                  </button>

                  {shop.verification?.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleVerify(shop._id, 'approve')}
                        disabled={processing}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-xl text-sm flex items-center gap-1 transition-colors"
                      >
                        <FiCheck size={14} /> Approve
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedShop?._id === shop._id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-3">Verification Documents</h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'GST Number', value: shop.verification?.gstNumber },
                      { label: 'PAN Number', value: shop.verification?.panNumber },
                      { label: 'Shop License', value: shop.verification?.shopLicenseNumber },
                      { label: 'Aadhar Number', value: shop.verification?.aadharNumber },
                      { label: 'Submitted', value: shop.verification?.submittedAt ? new Date(shop.verification.submittedAt).toLocaleDateString('en-IN') : '—' },
                      { label: 'Category', value: shop.category?.replace('_', ' ') },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="font-medium text-gray-900 text-sm">{item.value || '—'}</p>
                      </div>
                    ))}
                  </div>

                  {/* Document Images */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {[
                      { label: 'Shop Front', url: shop.verification?.shopFrontPhoto },
                      { label: 'License', url: shop.verification?.shopLicenseImage },
                      { label: 'GST Certificate', url: shop.verification?.gstCertificateImage },
                    ].filter(d => d.url).map((doc, i) => (
                      <div key={i} className="relative">
                        <p className="text-xs text-gray-500 mb-1">{doc.label}</p>
                        <img
                          src={doc.url}
                          alt={doc.label}
                          className="w-40 h-28 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80"
                          onClick={() => window.open(doc.url, '_blank')}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Rejection Reason (if rejected) */}
                  {shop.verification?.status === 'rejected' && shop.verification?.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-xs text-red-500 font-semibold mb-1">Rejection Reason:</p>
                      <p className="text-sm text-red-700">{shop.verification.rejectionReason}</p>
                    </div>
                  )}

                  {/* Admin Action Form (for pending shops) */}
                  {shop.verification?.status === 'pending' && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (optional)</label>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          className="input-field h-16 resize-none text-sm"
                          placeholder="Internal notes..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rejection Reason (required if rejecting)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="input-field h-16 resize-none text-sm"
                          placeholder="Why is this shop being rejected? (visible to shop owner)"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVerify(shop._id, 'approve')}
                          disabled={processing}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                          <FiCheck size={16} /> Approve Shop
                        </button>
                        <button
                          onClick={() => handleVerify(shop._id, 'reject')}
                          disabled={processing}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                          <FiX size={16} /> Reject Shop
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;