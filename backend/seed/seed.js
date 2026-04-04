const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Review = require('../models/Review');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Shop.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // ===================== ADMIN USER =====================
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@nearbystore.com',
      password: 'admin123',
      role: 'admin',
      phone: '9999999999'
    });
    console.log('✅ Admin user created');

    // CUSTOMERS
    const c1 = await User.create({ name: 'Rahul Kumar', email: 'rahul@example.com', password: 'password123', role: 'customer', phone: '9876543210' });
    const c2 = await User.create({ name: 'Priya Sharma', email: 'priya@example.com', password: 'password123', role: 'customer', phone: '9876543211' });
    const c3 = await User.create({ name: 'Ankit Joshi', email: 'ankit@example.com', password: 'password123', role: 'customer', phone: '9876543224' });

    // RETAILERS
    const r1 = await User.create({ name: 'Ramesh Bajaj', email: 'ramesh.bajaj@example.com', password: 'password123', role: 'retailer', phone: '9876543212' });
    const r2 = await User.create({ name: 'Prem Chand Aggarwal', email: 'premchand@example.com', password: 'password123', role: 'retailer', phone: '9876543213' });
    const r3 = await User.create({ name: 'Vinod Gupta', email: 'vinod.gupta@example.com', password: 'password123', role: 'retailer', phone: '9876543214' });
    const r4 = await User.create({ name: 'Harbans Lal Sharma', email: 'harbans@example.com', password: 'password123', role: 'retailer', phone: '9876543215' });
    const r5 = await User.create({ name: 'Ravi Kapoor', email: 'ravi.kapoor@example.com', password: 'password123', role: 'retailer', phone: '9876543216' });
    const r6 = await User.create({ name: 'Mohammed Irfan', email: 'irfan@example.com', password: 'password123', role: 'retailer', phone: '9876543217' });
    const r7 = await User.create({ name: 'Dharamvir Yadav', email: 'dharamvir@example.com', password: 'password123', role: 'retailer', phone: '9876543218' });
    const r8 = await User.create({ name: 'Sunil Jain', email: 'sunil.jain@example.com', password: 'password123', role: 'retailer', phone: '9876543219' });
    const r9 = await User.create({ name: 'Manish Kapoor', email: 'manish.kapoor@example.com', password: 'password123', role: 'retailer', phone: '9876543220' });
    const r10 = await User.create({ name: 'Geeta Devi', email: 'geeta.devi@example.com', password: 'password123', role: 'retailer', phone: '9876543221' });
    const r11 = await User.create({ name: 'Arun Malhotra', email: 'arun.malhotra@example.com', password: 'password123', role: 'retailer', phone: '9876543222' });
    const r12 = await User.create({ name: 'Satish Bhatia', email: 'satish.bhatia@example.com', password: 'password123', role: 'retailer', phone: '9876543223' });

    console.log('✅ 16 Users created (1 Admin + 3 Customers + 12 Retailers)');

    // ALL SHOPS IN MUMBAI — within 3-4 km of each other (around Dadar/Bandra area)
    const bajajAppliances = await Shop.create({
      owner: r1._id, shopName: 'Bajaj Home Appliances',
      description: 'Since 1985. Refrigerators, ACs, washing machines, water purifiers, geysers, fans and TVs.',
      address: 'Shop 23, Dadar West Market, Mumbai - 400028',
      phone: '022-24131001', category: 'home_appliances',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      location: { type: 'Point', coordinates: [72.8425, 19.0178] },
      analytics: { views: 320, clicks: 145 }
    });

    const premChandKitchen = await Shop.create({
      owner: r2._id, shopName: 'Prem Chand Kitchen Emporium',
      description: 'Mixer grinders, microwaves, cooktops, kettles, vacuum cleaners since 1992.',
      address: 'Shop 56, Linking Road, Bandra West, Mumbai - 400050',
      phone: '022-26481002', category: 'home_appliances',
      image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&h=300&fit=crop',
      location: { type: 'Point', coordinates: [72.8296, 19.0596] },
      analytics: { views: 275, clicks: 130 }
    });

    const guptaComputers = await Shop.create({
      owner: r3._id, shopName: 'Gupta Computers & Hardware',
      description: 'Processors, GPUs, RAM, SSDs, monitors, keyboards. Custom PC builds.',
      address: 'Shop 312, Lamington Road, Grant Road, Mumbai - 400007',
      phone: '022-23881003', category: 'hardware',
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
      location: { type: 'Point', coordinates: [72.8190, 18.9636] },
      analytics: { views: 510, clicks: 289 }
    });

    const sharmaHardware = await Shop.create({
      owner: r4._id, shopName: 'Sharma & Sons Hardware Store',
      description: 'Power tools, hand tools, locks, pipes, electrical fittings, paints. Since 1964.',
      address: 'Shop 89, Null Bazaar, Mohammed Ali Road, Mumbai - 400003',
      phone: '022-23451004', category: 'hardware',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      location: { type: 'Point', coordinates: [72.8347, 18.9553] },
      analytics: { views: 180, clicks: 78 }
    });

    const raviElectronics = await Shop.create({
      owner: r5._id, shopName: 'Ravi Electronics Emporium',
      description: 'Smartphones, laptops, tablets, smartwatches, power banks. Apple, Samsung authorized.',
      address: 'Shop 34, Heera Panna, Haji Ali, Mumbai - 400026',
      phone: '022-23521005', category: 'electronics',
      image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400&h=300&fit=crop',
      location: { type: 'Point', coordinates: [72.8127, 18.9862] },
      analytics: { views: 620, clicks: 345 }
    });

    const irfanAudio = await Shop.create({
      owner: r6._id, shopName: 'Irfan Sound & Music House',
      description: 'Headphones, earbuds, speakers, soundbars, home theaters, projectors.',
      address: 'Shop 67, Hill Road, Bandra West, Mumbai - 400050',
      phone: '022-26511006', category: 'electronics',
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop',
      location: { type: 'Point', coordinates: [72.8345, 19.0544] },
      analytics: { views: 290, clicks: 156 }
    });

    const yadavSports = await Shop.create({
      owner: r7._id, shopName: 'Yadav Sports Bhandar',
      description: 'Cricket, football, badminton, tennis, hockey equipment. SG, Yonex, Nike stockist.',
      address: 'Shop 45, Matunga Market, Matunga, Mumbai - 400019',
      phone: '022-24081007', category: 'sports',
      image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcfed?w=400&h=300&fit=crop',
      location: { type: 'Point', coordinates: [72.8562, 19.0273] },
      analytics: { views: 410, clicks: 198 }
    });

    const jainFitness = await Shop.create({
      owner: r8._id, shopName: 'Jain Fitness & Gym Equipment',
      description: 'Dumbbells, treadmills, yoga mats, cycling gear, swimming accessories.',
      address: 'Shop 22, Lokhandwala Complex, Andheri West, Mumbai - 400053',
      phone: '022-26321008', category: 'fitness',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
      location: { type: 'Point', coordinates: [72.8266, 19.1394] },
      analytics: { views: 345, clicks: 167 }
    });

    const kapoorWatchGallery = await Shop.create({
      owner: r9._id, shopName: 'Kapoor Watch Gallery & Accessories',
      description: 'Watches, sunglasses, wallets, belts, bags, jewelry. Titan, Fossil, Ray-Ban dealer.',
      address: 'Shop 78, Colaba Causeway, Colaba, Mumbai - 400005',
      phone: '022-22881009', category: 'accessories',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
      location: { type: 'Point', coordinates: [72.8326, 18.9217] },
      analytics: { views: 390, clicks: 210 }
    });

    const geetaStationery = await Shop.create({
      owner: r10._id, shopName: 'Geeta Book Depot & Stationery',
      description: 'Pens, notebooks, water bottles, flasks, eyewear, school supplies.',
      address: 'Shop 15, Vile Parle Station Road, Vile Parle East, Mumbai - 400057',
      phone: '022-26121010', category: 'stationery',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop',
      location: { type: 'Point', coordinates: [72.8544, 19.0968] },
      analytics: { views: 210, clicks: 95 }
    });

    const malhotraGrooming = await Shop.create({
      owner: r11._id, shopName: 'Malhotra Personal Care & Grooming',
      description: 'Trimmers, shavers, hair dryers, straighteners, perfumes, deodorants.',
      address: 'Shop 33, Phoenix Marketcity, Kurla West, Mumbai - 400070',
      phone: '022-25021011', category: 'personal_care',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
      location: { type: 'Point', coordinates: [72.8891, 19.0863] },
      analytics: { views: 175, clicks: 82 }
    });

    const bhatiaCamera = await Shop.create({
      owner: r12._id, shopName: 'Bhatia Camera House & Smart Home',
      description: 'DSLR cameras, drones, action cameras, routers, smart home devices.',
      address: 'Shop 90, Fort Market, DN Road, Fort, Mumbai - 400001',
      phone: '022-22071012', category: 'electronics',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
      location: { type: 'Point', coordinates: [72.8361, 18.9340] },
      analytics: { views: 260, clicks: 134 }
    });

    console.log('✅ 12 Shops created — ALL IN MUMBAI');

    // ===================== SET VERIFICATION STATUSES =====================

    // 4 shops VERIFIED (with GST, verified by admin)
    bajajAppliances.verification = {
      status: 'verified',
      gstNumber: '27AABCB9603R1ZM',
      panNumber: 'AABCB9603R',
      shopLicenseNumber: 'MH-MUM-2024-001',
      shopFrontPhoto: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      verifiedBy: admin._id,
      verifiedAt: new Date('2024-12-15'),
      submittedAt: new Date('2024-12-10'),
      adminNotes: 'All documents verified. Genuine shop since 1985.'
    };
    await bajajAppliances.save();

    raviElectronics.verification = {
      status: 'verified',
      gstNumber: '27AAPCR5678K1Z5',
      panNumber: 'AAPCR5678K',
      shopLicenseNumber: 'MH-MUM-2024-005',
      shopFrontPhoto: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400',
      verifiedBy: admin._id,
      verifiedAt: new Date('2024-12-18'),
      submittedAt: new Date('2024-12-14'),
      adminNotes: 'Apple & Samsung authorized dealer confirmed.'
    };
    await raviElectronics.save();

    premChandKitchen.verification = {
      status: 'verified',
      gstNumber: '27AADCP3456J1Z2',
      panNumber: 'AADCP3456J',
      shopFrontPhoto: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400',
      verifiedBy: admin._id,
      verifiedAt: new Date('2024-12-20'),
      submittedAt: new Date('2024-12-16'),
      adminNotes: 'Linking Road shop verified on site.'
    };
    await premChandKitchen.save();

    yadavSports.verification = {
      status: 'verified',
      gstNumber: '27AABCY7890L1Z8',
      shopLicenseNumber: 'MH-MUM-2024-007',
      shopFrontPhoto: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcfed?w=400',
      verifiedBy: admin._id,
      verifiedAt: new Date('2024-12-22'),
      submittedAt: new Date('2024-12-19'),
      adminNotes: 'SG and Yonex authorized stockist confirmed.'
    };
    await yadavSports.save();

    // 3 shops PENDING (submitted documents, waiting for admin review)
    guptaComputers.verification = {
      status: 'pending',
      gstNumber: '27AADCG1234M1Z8',
      panNumber: 'AADCG1234M',
      shopLicenseNumber: 'MH-MUM-2024-003',
      shopFrontPhoto: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400',
      gstCertificateImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
      submittedAt: new Date('2025-01-10')
    };
    await guptaComputers.save();

    irfanAudio.verification = {
      status: 'pending',
      gstNumber: '27AABCI4567N1Z3',
      shopFrontPhoto: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400',
      aadharNumber: '4567-8901-2345',
      submittedAt: new Date('2025-01-12')
    };
    await irfanAudio.save();

    jainFitness.verification = {
      status: 'pending',
      gstNumber: '27AADCJ8901P1Z6',
      panNumber: 'AADCJ8901P',
      shopFrontPhoto: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
      shopLicenseImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
      submittedAt: new Date('2025-01-14')
    };
    await jainFitness.save();

    // 1 shop REJECTED (needs to resubmit)
    malhotraGrooming.verification = {
      status: 'rejected',
      gstNumber: '27INVALID0000X',
      shopFrontPhoto: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      submittedAt: new Date('2025-01-08'),
      rejectionReason: 'GST number is invalid. Please provide a valid 15-digit GSTIN. Also upload a clearer photo of your shop front.',
      adminNotes: 'GST format check failed. Photo is blurry.'
    };
    await malhotraGrooming.save();

    // 4 shops remain UNVERIFIED (haven't applied yet):
    // sharmaHardware, kapoorWatchGallery, geetaStationery, bhatiaCamera

    console.log('✅ Verification statuses set:');
    console.log('   ✅ 4 Verified: Bajaj, Ravi Electronics, Prem Chand, Yadav Sports');
    console.log('   ⏳ 3 Pending: Gupta Computers, Irfan Audio, Jain Fitness');
    console.log('   ❌ 1 Rejected: Malhotra Grooming');
    console.log('   ⬜ 4 Unverified: Sharma Hardware, Kapoor Watch, Geeta Stationery, Bhatia Camera');

    // PRODUCTS
    await Product.insertMany([
      // BAJAJ HOME APPLIANCES
      { shop: bajajAppliances._id, productName: 'LG 260L Double Door Refrigerator', description: 'Smart Inverter, frost-free, convertible', category: 'refrigerators', brand: 'LG', image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop', price: 28990, stock: 8, unit: 'piece' },
      { shop: bajajAppliances._id, productName: 'Samsung 253L Frost Free Refrigerator', description: 'Digital Inverter, all-around cooling', category: 'refrigerators', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=300&h=300&fit=crop', price: 26490, stock: 6, unit: 'piece' },
      { shop: bajajAppliances._id, productName: 'Whirlpool 190L Single Door', description: 'Direct cool, stabilizer free', category: 'refrigerators', brand: 'Whirlpool', image: 'https://images.unsplash.com/photo-1536353284924-9220c464e262?w=300&h=300&fit=crop', price: 14990, stock: 12, unit: 'piece' },
      { shop: bajajAppliances._id, productName: 'Bosch 7kg Front Load Washing Machine', description: 'Anti-vibration, 1200 RPM, EcoSilence', category: 'washing_machines', brand: 'Bosch', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=300&fit=crop', price: 32990, stock: 4, unit: 'piece' },
      { shop: bajajAppliances._id, productName: 'Voltas 1.5 Ton 3 Star Split AC', description: 'Copper condenser, high ambient cooling', category: 'air_conditioners', brand: 'Voltas', image: 'https://images.unsplash.com/photo-1631545806609-11e16530d0c3?w=300&h=300&fit=crop', price: 33990, stock: 10, unit: 'piece' },
      { shop: bajajAppliances._id, productName: 'Kent Grand Plus RO Water Purifier', description: 'RO+UV+UF, 8 litre storage', category: 'water_purifiers', brand: 'Kent', image: 'https://images.unsplash.com/photo-1564419320461-6e1ab1031060?w=300&h=300&fit=crop', price: 18500, stock: 15, unit: 'piece' },
      { shop: bajajAppliances._id, productName: 'Samsung 55 inch Crystal 4K Smart TV', description: 'Crystal Processor 4K, HDR, Smart Hub', category: 'televisions', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop', price: 47990, stock: 3, unit: 'piece' },

      // PREM CHAND KITCHEN
      { shop: premChandKitchen._id, productName: 'Preethi Zodiac MG 218 Mixer Grinder', description: '750W, 5 jars, master chef jar', category: 'kitchen_appliances', brand: 'Preethi', image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=300&h=300&fit=crop', price: 6490, stock: 15, unit: 'piece' },
      { shop: premChandKitchen._id, productName: 'Bajaj Rex 500W Mixer Grinder', description: '3 jars, multi-purpose', category: 'kitchen_appliances', brand: 'Bajaj', image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=300&h=300&fit=crop', price: 2290, stock: 25, unit: 'piece' },
      { shop: premChandKitchen._id, productName: 'IFB 25L Convection Microwave Oven', description: '300+ menus, rotisserie, child lock', category: 'microwave_ovens', brand: 'IFB', image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=300&fit=crop', price: 13490, stock: 6, unit: 'piece' },
      { shop: premChandKitchen._id, productName: 'Prestige Iris 3 Burner Gas Stove', description: 'Toughened glass, brass burners', category: 'cooktops_stoves', brand: 'Prestige', image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=300&fit=crop', price: 3890, stock: 10, unit: 'piece' },
      { shop: premChandKitchen._id, productName: 'Dyson V8 Absolute Cordless Vacuum', description: '40 min runtime, HEPA filtration', category: 'vacuum_cleaners', brand: 'Dyson', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&h=300&fit=crop', price: 35900, stock: 2, unit: 'piece' },

      // GUPTA COMPUTERS
      { shop: guptaComputers._id, productName: 'Intel Core i5-13400F Processor', description: '10 cores, 16 threads, LGA 1700', category: 'computer_hardware', brand: 'Intel', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&h=300&fit=crop', price: 15490, stock: 12, unit: 'piece' },
      { shop: guptaComputers._id, productName: 'AMD Ryzen 5 5600X Processor', description: '6 cores, 12 threads, AM4', category: 'computer_hardware', brand: 'AMD', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&h=300&fit=crop', price: 13990, stock: 10, unit: 'piece' },
      { shop: guptaComputers._id, productName: 'NVIDIA GeForce RTX 4060 8GB', description: 'DLSS 3.0, ray tracing, PCIe 4.0', category: 'computer_hardware', brand: 'NVIDIA', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&h=300&fit=crop', price: 29990, stock: 4, unit: 'piece' },
      { shop: guptaComputers._id, productName: 'Samsung 970 EVO Plus 1TB NVMe SSD', description: '3500MB/s read, V-NAND', category: 'computer_hardware', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=300&fit=crop', price: 6490, stock: 20, unit: 'piece' },
      { shop: guptaComputers._id, productName: 'Logitech G102 Gaming Mouse', description: '8000 DPI, RGB, 6 buttons', category: 'computer_hardware', brand: 'Logitech', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop', price: 1295, stock: 40, unit: 'piece' },

      // SHARMA HARDWARE
      { shop: sharmaHardware._id, productName: 'Bosch GSB 550 Impact Drill Kit', description: '550W, 13mm chuck, 100pc kit', category: 'power_tools', brand: 'Bosch', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=300&fit=crop', price: 3490, stock: 15, unit: 'piece' },
      { shop: sharmaHardware._id, productName: 'Stanley 8-Piece Screwdriver Set', description: 'Chrome vanadium, cushion grip', category: 'hand_tools', brand: 'Stanley', image: 'https://images.unsplash.com/photo-1530124566582-a45a7e3d0bf8?w=300&h=300&fit=crop', price: 790, stock: 30, unit: 'set' },
      { shop: sharmaHardware._id, productName: 'Godrej NavTal 7 Lever Padlock', description: 'Hardened shackle, 3 keys', category: 'locks_security', brand: 'Godrej', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop', price: 590, stock: 40, unit: 'piece' },
      { shop: sharmaHardware._id, productName: 'Asian Paints Apcolite Emulsion 4L', description: 'Interior, washable, smooth finish', category: 'paint_coatings', brand: 'Asian Paints', image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300&h=300&fit=crop', price: 1690, stock: 25, unit: 'piece' },

      // RAVI ELECTRONICS
      { shop: raviElectronics._id, productName: 'Samsung Galaxy S24 128GB', description: 'Galaxy AI, 50MP camera, AMOLED', category: 'smartphones', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop', price: 74999, stock: 8, unit: 'piece' },
      { shop: raviElectronics._id, productName: 'Apple iPhone 15 128GB', description: 'A16 Bionic, Dynamic Island, USB-C', category: 'smartphones', brand: 'Apple', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop', price: 79900, stock: 5, unit: 'piece' },
      { shop: raviElectronics._id, productName: 'Apple MacBook Air M2 256GB', description: '8-core GPU, 13.6" Liquid Retina', category: 'laptops', brand: 'Apple', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop', price: 99900, stock: 3, unit: 'piece' },
      { shop: raviElectronics._id, productName: 'Dell Inspiron 15 i5 Laptop', description: '8GB RAM, 512GB SSD, FHD', category: 'laptops', brand: 'Dell', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop', price: 52990, stock: 5, unit: 'piece' },
      { shop: raviElectronics._id, productName: 'Anker 20000mAh Power Bank', description: 'PowerIQ, dual USB, fast charge', category: 'chargers_powerbanks', brand: 'Anker', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop', price: 2499, stock: 25, unit: 'piece' },

      // IRFAN AUDIO
      { shop: irfanAudio._id, productName: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading ANC, 30hr battery', category: 'headphones_earbuds', brand: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', price: 26990, stock: 6, unit: 'piece' },
      { shop: irfanAudio._id, productName: 'Boat Airdopes 141 TWS Earbuds', description: '42hr playback, IPX4, 8mm drivers', category: 'headphones_earbuds', brand: 'Boat', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f6d?w=300&h=300&fit=crop', price: 1299, stock: 40, unit: 'piece' },
      { shop: irfanAudio._id, productName: 'JBL Flip 6 Bluetooth Speaker', description: 'IP67, 12hr battery, PartyBoost', category: 'speakers', brand: 'JBL', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop', price: 9999, stock: 10, unit: 'piece' },
      { shop: irfanAudio._id, productName: 'Sony HT-S400 2.1ch Soundbar', description: 'Wireless sub, Dolby Audio, 330W', category: 'sound_systems', brand: 'Sony', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&h=300&fit=crop', price: 19990, stock: 4, unit: 'piece' },

      // YADAV SPORTS
      { shop: yadavSports._id, productName: 'SG Nexus Plus Cricket Bat', description: 'Kashmir Willow, thick edges', category: 'cricket', brand: 'SG', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&h=300&fit=crop', price: 2490, stock: 15, unit: 'piece' },
      { shop: yadavSports._id, productName: 'Nike Flight Match Football', description: 'FIFA Quality Pro, size 5', category: 'football', brand: 'Nike', image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=300&h=300&fit=crop', price: 3990, stock: 10, unit: 'piece' },
      { shop: yadavSports._id, productName: 'Yonex Nanoray Light 18i Racket', description: '77g, isometric head, strung', category: 'badminton', brand: 'Yonex', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300&h=300&fit=crop', price: 1890, stock: 12, unit: 'piece' },

      // JAIN FITNESS
      { shop: jainFitness._id, productName: 'PowerMax 10kg Hex Dumbbell Pair', description: 'Anti-roll, chrome handle', category: 'gym_workout', brand: 'PowerMax', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop', price: 2490, stock: 15, unit: 'pair' },
      { shop: jainFitness._id, productName: 'Nike Air Zoom Pegasus 40', description: 'React foam, Zoom Air unit', category: 'athletics_running', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', price: 10795, stock: 8, unit: 'pair' },
      { shop: jainFitness._id, productName: 'Reebok 6mm Yoga Mat', description: 'Reversible, textured, carry strap', category: 'yoga_mats', brand: 'Reebok', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&fit=crop', price: 1490, stock: 20, unit: 'piece' },
      { shop: jainFitness._id, productName: 'Fitbit Charge 6 Fitness Band', description: 'GPS, heart rate, 7-day battery', category: 'fitness_bands', brand: 'Fitbit', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop', price: 14999, stock: 8, unit: 'piece' },

      // KAPOOR WATCH GALLERY
      { shop: kapoorWatchGallery._id, productName: 'Titan Octane Chronograph Watch', description: 'Stainless steel, 100m WR', category: 'watches', brand: 'Titan', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop', price: 5995, stock: 10, unit: 'piece' },
      { shop: kapoorWatchGallery._id, productName: 'Ray-Ban Aviator Classic RB3025', description: 'Gold frame, green G-15 lens', category: 'sunglasses', brand: 'Ray-Ban', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop', price: 7990, stock: 10, unit: 'piece' },
      { shop: kapoorWatchGallery._id, productName: 'Samsonite Spinner 68cm Trolley', description: 'TSA lock, 4 wheels, expandable', category: 'luggage', brand: 'Samsonite', image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=300&h=300&fit=crop', price: 8990, stock: 5, unit: 'piece' },

      // GEETA STATIONERY
      { shop: geetaStationery._id, productName: 'Parker Classic Gold Trim Ball Pen', description: 'Stainless steel, gold plated clip', category: 'pens_notebooks', brand: 'Parker', image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&h=300&fit=crop', price: 390, stock: 20, unit: 'piece' },
      { shop: geetaStationery._id, productName: 'Milton Thermosteel 1L Flask', description: '24hr hot/cold, stainless steel', category: 'water_bottles_flasks', brand: 'Milton', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop', price: 890, stock: 25, unit: 'piece' },
      { shop: geetaStationery._id, productName: 'Lenskart Hustlr Blue Light Glasses', description: 'Anti-glare, zero power', category: 'eyewear', brand: 'Lenskart', image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=300&fit=crop', price: 1290, stock: 20, unit: 'piece' },

      // MALHOTRA GROOMING
      { shop: malhotraGrooming._id, productName: 'Philips BT3221 Beard Trimmer', description: '20 length settings, 90 min runtime', category: 'trimmers_shavers', brand: 'Philips', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=300&h=300&fit=crop', price: 1795, stock: 15, unit: 'piece' },
      { shop: malhotraGrooming._id, productName: 'Fogg Scent Xpressio Perfume 100ml', description: 'Long lasting, citrus woody', category: 'deodorants_perfumes', brand: 'Fogg', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop', price: 499, stock: 30, unit: 'piece' },

      // BHATIA CAMERA
      { shop: bhatiaCamera._id, productName: 'Canon EOS R50 Mirrorless Camera', description: '24.2MP, 4K video, Dual Pixel AF', category: 'cameras', brand: 'Canon', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop', price: 59990, stock: 3, unit: 'piece' },
      { shop: bhatiaCamera._id, productName: 'DJI Mini 4 Pro Drone', description: '4K/60fps, 34 min flight, 249g', category: 'drones_action_cameras', brand: 'DJI', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&h=300&fit=crop', price: 79990, stock: 2, unit: 'piece' },
      { shop: bhatiaCamera._id, productName: 'TP-Link Archer AX73 WiFi 6 Router', description: 'AX5400, dual band, 6 antennas', category: 'routers_modems', brand: 'TP-Link', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&h=300&fit=crop', price: 6999, stock: 10, unit: 'piece' },
      { shop: bhatiaCamera._id, productName: 'Amazon Echo Dot 5th Gen', description: 'Alexa, improved bass, smart home hub', category: 'smart_home_devices', brand: 'Amazon', image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=300&h=300&fit=crop', price: 4499, stock: 15, unit: 'piece' },
    ]);

    console.log('✅ 50+ Products created');

    // REVIEWS
    await Review.insertMany([
      { user: c1._id, shop: bajajAppliances._id, rating: 5, comment: 'Best appliance store in Dadar! Ramesh bhai gave best price.' },
      { user: c1._id, shop: raviElectronics._id, rating: 5, comment: 'Got iPhone 15 from here. Genuine with bill.' },
      { user: c1._id, shop: yadavSports._id, rating: 4, comment: 'Good cricket bat collection.' },
      { user: c2._id, shop: premChandKitchen._id, rating: 5, comment: 'Best kitchen store on Linking Road!' },
      { user: c2._id, shop: irfanAudio._id, rating: 5, comment: 'Amazing headphones collection in Bandra.' },
      { user: c2._id, shop: geetaStationery._id, rating: 5, comment: 'My go-to for stationery in Vile Parle.' },
      { user: c3._id, shop: guptaComputers._id, rating: 5, comment: 'Best computer shop on Lamington Road!' },
      { user: c3._id, shop: jainFitness._id, rating: 5, comment: 'Great gym equipment in Andheri.' },
      { user: c3._id, shop: bhatiaCamera._id, rating: 4, comment: 'Good camera shop in Fort area.' },
    ]);

    console.log('✅ 9 Reviews created');

    console.log('\n========================================');
    console.log('🎉 SEED COMPLETE — ALL MUMBAI LOCATIONS');
    console.log('========================================');
    console.log('ADMIN:     admin@nearbystore.com / admin123');
    console.log('CUSTOMERS: rahul@example.com / priya@example.com / ankit@example.com');
    console.log('RETAILERS: ramesh.bajaj@example.com / premchand@example.com / vinod.gupta@example.com');
    console.log('(All passwords: password123, Admin password: admin123)');
    console.log('========================================');
    console.log('VERIFICATION STATUS:');
    console.log('  ✅ Verified (4): Bajaj, Ravi Electronics, Prem Chand, Yadav Sports');
    console.log('  ⏳ Pending  (3): Gupta Computers, Irfan Audio, Jain Fitness');
    console.log('  ❌ Rejected (1): Malhotra Grooming');
    console.log('  ⬜ Unverified(4): Sharma Hardware, Kapoor Watch, Geeta Stationery, Bhatia Camera');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();