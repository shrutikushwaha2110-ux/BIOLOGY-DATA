import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ResearchCard({
  title,
  category,
  summary,
  thumbnail,
  tags = [],
  authors,
  year,
  onClick
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group">
      {thumbnail && (
        <div className="h-48 overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            {category}
          </span>
          {year && (
            <span className="text-xs text-gray-500">{year}</span>
          )}
        </div>
        <h3 className="text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
          {title}
        </h3>
        {authors && (
          <p className="text-sm text-gray-600 mb-2">{authors}</p>
        )}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{summary}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {tag}
              </span>
            ))}

          </div>

        )}
        <button
          onClick={onClick}
          className="flex items-center text-sm text-green-600 hover:text-green-700 group/btn"
        >
          View Study
          <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
