import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { RetailerSidebar } from './RetailerDashboard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { FiMenu, FiSave, FiAlertTriangle, FiCheck } from 'react-icons/fi';

const RetailerInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedProducts, setEditedProducts] = useState({});
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products/my-products');
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (productId, field, value) => {
    setEditedProducts({
      ...editedProducts,
      [productId]: {
        ...editedProducts[productId],
        [field]: value,
      },
    });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editedProducts);
      await Promise.all(
        updates.map(([id, data]) => {
          const updateData = {};
          if (data.price !== undefined) updateData.price = parseFloat(data.price);
          if (data.stock !== undefined) updateData.stock = parseInt(data.stock);
          if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;
          return API.put(`/products/${id}`, updateData);
        })
      );
      toast.success(`${updates.length} product(s) updated!`);
      setEditedProducts({});
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filter === 'low') return p.stock < 5;
    if (filter === 'out') return p.stock === 0;
    return true;
  });

  const hasChanges = Object.keys(editedProducts).length > 0;

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <RetailerSidebar active="inventory" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden mb-4 p-2 hover:bg-gray-100 rounded-lg">
          <FiMenu size={20} />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-500 text-sm">Update prices and stock levels</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-xl p-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'low', label: '⚠️ Low Stock' },
                { key: 'out', label: '❌ Out' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {hasChanges && (
              <button onClick={saveAll} disabled={saving} className="btn-primary flex items-center gap-2 text-sm py-2">
                <FiSave size={16} /> {saving ? 'Saving...' : `Save (${Object.keys(editedProducts).length})`}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredProducts.length === 0 ? (
          <div className="card p-12 text-center text-gray-500">
            {filter === 'all' ? 'No products found' : 'No products match this filter'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const edited = editedProducts[product._id] || {};
              const currentPrice = edited.price !== undefined ? edited.price : product.price;
              const currentStock = edited.stock !== undefined ? edited.stock : product.stock;
              const isEdited = edited.price !== undefined || edited.stock !== undefined;

              return (
                <div key={product._id} className={`card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${isEdited ? 'border-primary-200 bg-primary-50/30' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{product.productName}</h3>
                      {isEdited && <FiCheck className="text-primary-600 flex-shrink-0" size={16} />}
                    </div>
                    <span className="text-xs text-gray-400 capitalize">{product.category.replace('_', ' ')}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentPrice}
                        onChange={(e) => handleChange(product._id, 'price', e.target.value)}
                        className="input-field w-28 py-2 text-sm text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Stock</label>
                      <input
                        type="number"
                        min="0"
                        value={currentStock}
                        onChange={(e) => handleChange(product._id, 'stock', e.target.value)}
                        className={`input-field w-24 py-2 text-sm text-center ${currentStock < 5 ? 'border-orange-300 bg-orange-50' : ''}`}
                      />
                    </div>
                    {currentStock < 5 && currentStock > 0 && (
                      <FiAlertTriangle className="text-orange-500 flex-shrink-0" size={18} title="Low stock" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default RetailerInventory;