// frontend/src/components/ShopGroupCard.js
// Displays a shop with all its matching products (grouped view)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import { FiNavigation, FiShoppingBag } from 'react-icons/fi';

const ShopGroupCard = ({ shopData }) => {
  const navigate = useNavigate();
  const { shop, products, distance } = shopData;

  if (!shop) return null;

  return (
    <div className="card overflow-hidden">
      {/* Shop Header */}
      <div
        onClick={() => navigate(`/customer/shop/${shop._id}`)}
        className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {shop.image ? (
            <img
              src={shop.image}
              alt={shop.shopName}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              🏪
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 truncate">{shop.shopName}</h3>
              {distance !== undefined && (
                <span className="flex items-center gap-1 text-xs text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                  <FiNavigation size={10} />
                  {distance} km
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">{shop.address}</p>
            <div className="flex items-center gap-2 mt-1">
              <StarRating
                rating={shop.averageRating || 0}
                count={shop.reviewCount}
                size={12}
              />
              <span className="text-xs text-gray-400 capitalize">
                {shop.category?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="divide-y divide-gray-50">
        {products.map((product) => (
          <div
            key={product._id}
            className="p-4 flex items-center gap-3 hover:bg-gray-50/50 transition-colors"
          >
            {/* Product Image */}
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiShoppingBag className="text-gray-300" size={18} />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-1">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {product.productName}
                </p>
                {product.brand && (
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                    {product.brand}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 truncate">{product.description}</p>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
              <span
                className={`text-[10px] font-medium ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => navigate(`/customer/shop/${shop._id}`)}
          className="w-full text-center text-xs font-semibold text-primary-600 hover:text-primary-700 py-1"
        >
          View all products at {shop.shopName} →
        </button>
      </div>
    </div>
  );
};

export default ShopGroupCard;