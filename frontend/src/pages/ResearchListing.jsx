import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { ResearchCard } from '../components/ResearchCard';
import { fetchResearchItems, searchResearch } from '../api';

export function ResearchListing({ onNavigate, initialCategory = 'All' }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [searchQuery, setSearchQuery] = useState('');
  const [researchItems, setResearchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ['All', 'Genomics', 'Genetics', 'Agriculture', 'Biology', 'Uncategorized'];
  const years = ['All Years', '2025', '2024', '2023', '2022', '2021', '2020'];

  // Apply initialCategory when it changes
  useEffect(() => {
    setSelectedCategory(initialCategory);
    setCurrentPage(1);
  }, [initialCategory]);

  // Fetch research items on mount
  useEffect(() => {
    async function loadResearch() {
      try {
        setLoading(true);
        const data = await fetchResearchItems();
        setResearchItems(data);
        setError(null);
      } catch (err) {
        console.error('Error loading research:', err);
        setError('Failed to load research data. Please make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    }
    loadResearch();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      const data = await fetchResearchItems();
      setResearchItems(data);
      return;
    }
    try {
      setLoading(true);
      const result = await searchResearch(searchQuery);
      setResearchItems(result.results || []);
      setCurrentPage(1);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedYear('All Years');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Filter items
  const filteredItems = researchItems.filter(item => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    const yearMatch = selectedYear === 'All Years' || item.year === selectedYear;
    return categoryMatch && yearMatch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Research Database</h1>
          <p className="text-xl text-gray-600">Browse and explore peer-reviewed biological research</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by keyword, author, or title..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-3">
              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowYearDropdown(false); }}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors flex items-center gap-2 bg-white"
                >
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{selectedCategory}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setShowCategoryDropdown(false); setCurrentPage(1); }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedCategory === cat ? 'bg-green-50 text-green-600' : 'text-gray-700'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowYearDropdown(!showYearDropdown); setShowCategoryDropdown(false); }}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors flex items-center gap-2 bg-white"
                >
                  <span className="text-sm text-gray-700">{selectedYear}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                {showYearDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
                    {years.map(year => (
                      <button
                        key={year}
                        onClick={() => { setSelectedYear(year); setShowYearDropdown(false); setCurrentPage(1); }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedYear === year ? 'bg-green-50 text-green-600' : 'text-gray-700'}`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'All' || selectedYear !== 'All Years') && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedYear !== 'All Years' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                    {selectedYear}
                    <button onClick={() => setSelectedYear('All Years')}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {paginatedItems.length} of {filteredItems.length} research papers
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Research Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading research data...</p>
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No research items found. Try adjusting your filters.</p>
            <button onClick={clearFilters} className="mt-4 text-green-600 hover:text-green-700">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => (
              <ResearchCard
                key={item.id}
                title={item.title}
                category={item.category}
                summary={item.description || item.summary || ''}
                thumbnail={item.thumbnail}
                tags={item.tags}
                authors={item.authors}
                year={item.year}
                onClick={() => onNavigate('detail', item.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-lg text-sm ${currentPage === 1 ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg text-sm ${currentPage === page ? 'bg-green-600 text-white' : 'border border-gray-200 hover:border-gray-300 text-gray-700'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded-lg text-sm ${currentPage === totalPages ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

