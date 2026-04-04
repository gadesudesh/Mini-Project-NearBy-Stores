import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, size = 16, showNumber = true, count }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} size={size} className="text-yellow-400" />);
    } else if (i === fullStars && hasHalf) {
      stars.push(<FaStarHalfAlt key={i} size={size} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} size={size} className="text-gray-300" />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {showNumber && <span className="text-sm font-medium text-gray-600 ml-1">{rating}</span>}
      {count !== undefined && <span className="text-xs text-gray-400">({count})</span>}
    </div>
  );
};

export default StarRating;