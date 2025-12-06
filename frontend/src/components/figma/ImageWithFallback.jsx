import { useState } from 'react';

export function ImageWithFallback({ src, alt, className, ...props }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className || ''}`}>
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className={`bg-gray-200 animate-pulse ${className || ''}`} />
      )}
      <img
        src={src}
        alt={alt || ''}
        className={className}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        style={{ display: loading ? 'none' : 'block' }}
        {...props}
      />
    </>
  );
}
