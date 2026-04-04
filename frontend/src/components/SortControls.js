// frontend/src/components/SortControls.js
// Reusable sort & view toggle controls for search results

import React from 'react';
import { FiList, FiGrid } from 'react-icons/fi';

const SortControls = ({ sort, setSort, viewMode, setViewMode }) => {
  return (
    <div className="card p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
      {/* Sort Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field py-2 px-3 text-sm w-auto"
          >
            <option value="price">Price: Low → High</option>
            <option value="-price">Price: High → Low</option>
            <option value="distance">Distance: Nearest</option>
            <option value="name">Name: A → Z</option>
          </select>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            viewMode === 'list'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiList size={14} />
          List View
        </button>
        <button
          onClick={() => setViewMode('grouped')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            viewMode === 'grouped'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiGrid size={14} />
          By Shop
        </button>
      </div>
    </div>
  );
};

export default SortControls;