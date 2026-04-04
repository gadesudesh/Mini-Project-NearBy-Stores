const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  productName: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, maxlength: 500, default: '' },
  category: {
    type: String, required: true,
    enum: [
      'refrigerators', 'washing_machines', 'air_conditioners', 'microwave_ovens',
      'water_purifiers', 'kitchen_appliances', 'vacuum_cleaners', 'water_heaters',
      'electric_fans', 'cooktops_stoves', 'televisions',
      'computer_hardware', 'hand_tools', 'power_tools', 'locks_security',
      'pipes_fittings', 'electrical_hardware', 'paint_coatings', 'fasteners',
      'smartphones', 'tablets', 'smartwatches', 'chargers_powerbanks', 'laptops',
      'desktops', 'computer_accessories', 'printers', 'led_lcd_tvs', 'sound_systems',
      'projectors', 'headphones_earbuds', 'speakers', 'cameras', 'drones_action_cameras',
      'routers_modems', 'smart_home_devices', 'trimmers_shavers', 'hair_dryers',
      'electric_toothbrushes',
      'cricket', 'football', 'badminton', 'tennis', 'table_tennis', 'hockey',
      'athletics_running', 'gym_workout', 'swimming', 'cycling', 'indoor_games', 'yoga_fitness',
      'watches', 'sunglasses', 'wallets_belts', 'jewelry', 'backpacks_bags', 'luggage',
      'travel_accessories', 'phone_cases', 'cables_adapters',
      'haircare_accessories', 'deodorants_perfumes',
      'pens_notebooks', 'water_bottles_flasks', 'eyewear',
      'fitness_bands', 'gym_bags_gloves', 'yoga_mats',
      'fruits', 'vegetables', 'dairy', 'bakery', 'beverages', 'snacks',
      'electronics', 'clothing', 'household', 'personal_care', 'medicine', 'stationery', 'other'
    ],
    default: 'other'
  },
  brand: { type: String, default: '', maxlength: 50 },
  image: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  unit: { type: String, default: 'piece', enum: ['piece', 'kg', 'g', 'l', 'ml', 'dozen', 'pack', 'set', 'pair'] },
  isAvailable: { type: Boolean, default: true },
  analytics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  }
}, { timestamps: true });

productSchema.index({ productName: 'text', category: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);