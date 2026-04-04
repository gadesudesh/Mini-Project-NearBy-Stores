import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { RetailerSidebar } from './RetailerDashboard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiMenu, FiImage } from 'react-icons/fi';

const CATEGORIES = [
  'refrigerators','washing_machines','air_conditioners','microwave_ovens',
  'water_purifiers','kitchen_appliances','vacuum_cleaners','water_heaters',
  'electric_fans','cooktops_stoves','televisions',
  'computer_hardware','hand_tools','power_tools','locks_security',
  'pipes_fittings','electrical_hardware','paint_coatings','fasteners',
  'smartphones','tablets','smartwatches','chargers_powerbanks','laptops',
  'desktops','computer_accessories','printers','led_lcd_tvs','sound_systems',
  'projectors','headphones_earbuds','speakers','cameras','drones_action_cameras',
  'routers_modems','smart_home_devices','trimmers_shavers','hair_dryers',
  'electric_toothbrushes',
  'cricket','football','badminton','tennis','table_tennis','hockey',
  'athletics_running','gym_workout','swimming','cycling','indoor_games','yoga_fitness',
  'watches','sunglasses','wallets_belts','jewelry','backpacks_bags','luggage',
  'travel_accessories','phone_cases','cables_adapters',
  'haircare_accessories','deodorants_perfumes',
  'pens_notebooks','water_bottles_flasks','eyewear',
  'fitness_bands','gym_bags_gloves','yoga_mats',
  'fruits','vegetables','dairy','bakery','beverages','snacks',
  'electronics','clothing','household','personal_care','medicine','stationery','other'
];
const UNITS = ['piece','kg','g','l','ml','dozen','pack','set','pair'];

const RetailerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    productName: '', description: '', category: 'other',
    brand: '', price: '', stock: '', unit: 'piece', image: ''
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products/my-products');
      setProducts(res.data.products);
    } catch(e){} finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ productName: '', description: '', category: 'other', brand: '', price: '', stock: '', unit: 'piece', image: '' });
    setEditingProduct(null);
  };

  const openAdd = () => { resetForm(); setShowModal(true); };

  const openEdit = (p) => {
    setEditingProduct(p);
    setForm({
      productName: p.productName, description: p.description || '',
      category: p.category, brand: p.brand || '',
      price: p.price.toString(), stock: p.stock.toString(),
      unit: p.unit, image: p.image || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, data);
        toast.success('Product updated!');
      } else {
        await API.post('/products', data);
        toast.success('Product added!');
      }
      setShowModal(false); resetForm(); fetchProducts();
    } catch(err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await API.delete(`/products/${id}`); toast.success('Deleted'); fetchProducts(); }
    catch(e) { toast.error('Failed to delete'); }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <RetailerSidebar active="products" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden mb-4 p-2 hover:bg-gray-100 rounded-lg">
          <FiMenu size={20} />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 text-sm">{products.length} products listed</p>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <FiPlus size={18} /> Add Product
          </button>
        </div>

        {loading ? <LoadingSpinner /> : products.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-4">Add your first product to start selling</p>
            <button onClick={openAdd} className="btn-primary inline-flex items-center gap-2">
              <FiPlus size={18} /> Add Product
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p._id} className="card overflow-hidden">
                {/* Product Image */}
                {p.image && (
                  <div className="w-full h-40 overflow-hidden">
                    <img src={p.image} alt={p.productName} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{p.productName}</h3>
                      {p.brand && <span className="text-xs text-blue-600 font-medium">{p.brand}</span>}
                    </div>
                    <span className="text-lg font-bold text-primary-600 ml-2">₹{p.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-gray-500">{p.category.replace('_',' ')}</span>
                    <span className={`font-medium ${p.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>{p.stock} {p.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="flex-1 btn-secondary py-2 text-xs flex items-center justify-center gap-1">
                      <FiEdit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold">{editingProduct ? 'Edit' : 'Add'} Product</h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                  <input type="text" value={form.productName} onChange={(e) => setForm({...form, productName: e.target.value})} className="input-field" required placeholder="e.g. Samsung Galaxy S24" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-field h-20 resize-none" placeholder="Describe the product..." />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                  <input type="text" value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})} className="input-field" placeholder="e.g. Samsung, Nike, Bosch" />
                </div>

                {/* IMAGE URL FIELD */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FiImage className="inline mr-1" size={14} /> Product Image URL
                  </label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({...form, image: e.target.value})}
                    className="input-field"
                    placeholder="https://example.com/product-image.jpg"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Paste a link to any product image from the internet
                  </p>
                  {/* Image Preview */}
                  {form.image && (
                    <div className="mt-2 relative">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setForm({...form, image: ''})}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input-field">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                    <select value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})} className="input-field">
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                    <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="input-field" required placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock *</label>
                    <input type="number" min="0" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} className="input-field" required placeholder="0" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 btn-secondary">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary">{editingProduct ? 'Update' : 'Add'} Product</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RetailerProducts;