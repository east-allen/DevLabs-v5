import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ 
  rating, 
  onRatingChange, 
  size = 'md', 
  interactive = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 1; i <= fullStars; i++) {
      stars.push(
        <button
          key={`star-${i}`}
          type="button"
          onClick={() => handleStarClick(i)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} 
            text-yellow-400 ${sizeClasses[size]} transition-transform duration-150`}
          disabled={!interactive}
          aria-label={`Rate ${i} out of 5`}
        >
          <Star className="fill-current" />
        </button>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <button
          key="half-star"
          type="button"
          onClick={() => handleStarClick(fullStars + 0.5)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} 
            text-yellow-400 ${sizeClasses[size]} transition-transform duration-150`}
          disabled={!interactive}
          aria-label={`Rate ${fullStars + 0.5} out of 5`}
        >
          <StarHalf className="fill-current" />
        </button>
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      const starValue = fullStars + (hasHalfStar ? 1 : 0) + i + 1;
      stars.push(
        <button
          key={`empty-star-${i}`}
          type="button"
          onClick={() => handleStarClick(starValue)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} 
            text-gray-300 ${sizeClasses[size]} transition-transform duration-150`}
          disabled={!interactive}
          aria-label={`Rate ${starValue} out of 5`}
        >
          <Star className="fill-current" />
        </button>
      );
    }

    return stars;
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {renderStars()}
      </div>
      {interactive && (
        <span className="ml-2 text-sm text-gray-500">
          {rating.toFixed(1)} / 5.0
        </span>
      )}
    </div>
  );
};

export default StarRating;
