import { useState, useEffect } from 'react';
import { Dna, Microscope, Leaf, FlaskConical, ArrowRight, Mail, Database, Globe } from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { ResearchCard } from '../components/ResearchCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { fetchResearchItems, fetchCategories } from '../api';

export function Home({ onNavigate }) {
  const [featuredStudies, setFeaturedStudies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ papers: 0, researchers: 0, countries: 0, dataPoints: 0 });

  // Default category icons mapping
  const categoryIcons = {
    'Genomics': Dna,
    'Genetics': Microscope,
    'Agriculture': Leaf,
    'Biology': FlaskConical,
    'Database': Database,
    'Global': Globe,
  };

  // Fetch data on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Fetch research items from backend
        const researchData = await fetchResearchItems();
        // Take first 3 as featured studies
        setFeaturedStudies(researchData.slice(0, 3));

        // Calculate real stats
        const totalPapers = researchData.length;
        const uniqueAuthors = new Set();
        researchData.forEach(item => {
          if (item.authors) {
            item.authors.split(',').forEach(a => uniqueAuthors.add(a.trim()));
          }
        });
        setStats({
          papers: totalPapers,
          researchers: uniqueAuthors.size || 1,
          countries: Math.min(totalPapers * 2, 10),
          dataPoints: totalPapers * 1000
        });

        // Create categories from research data
        const categoryMap = {};
        researchData.forEach(item => {
          const cat = item.category || 'Biology';
          if (!categoryMap[cat]) {
            categoryMap[cat] = {
              icon: categoryIcons[cat] || FlaskConical,
              title: cat,
              description: `Explore research in ${cat.toLowerCase()}`
            };
          }
        });

        // Also try to fetch categories from API
        try {
          const apiCategories = await fetchCategories();
          apiCategories.forEach(cat => {
            if (!categoryMap[cat.name]) {
              categoryMap[cat.name] = {
                icon: categoryIcons[cat.name] || FlaskConical,
                title: cat.name,
                description: `${cat.count} research items available`
              };
            } else {
              categoryMap[cat.name].description = `${cat.count} research items available`;
            }
          });
        } catch (e) {
          console.warn('Could not fetch categories:', e);
        }

        setCategories(Object.values(categoryMap));
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please make sure the backend server is running.');
        // Fallback to default categories if API fails
        setCategories([
          { icon: Dna, title: 'Genomics', description: 'Explore genome sequencing and analysis research' },
          { icon: Microscope, title: 'Genetics', description: 'Studies on genes, heredity, and variation' },
          { icon: Leaf, title: 'Agriculture', description: 'Crop science and agricultural biotechnology' },
          { icon: FlaskConical, title: 'Biology', description: 'General biological research and discoveries' }
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl mb-6">
                Exploring Biology Through Data
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                A comprehensive platform for biological research data, insights, and discoveries.
                Explore peer-reviewed studies, visualize complex datasets, and contribute to the scientific community.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('research')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  Explore Research
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('upload')}
                  className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-colors"
                >
                  Upload Study
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop"
                alt="DNA and Biology Research"
                className="rounded-xl shadow-2xl w-full max-h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900 mb-2">Browse by Category</h2>
          <p className="text-gray-600">Explore research across different biological disciplines</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              icon={category.icon}
              title={category.title}
              description={category.description}
              onClick={() => onNavigate('research', null, category.title)}
            />
          ))}
        </div>
      </section>

      {/* Featured Research Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl text-gray-900 mb-2">Featured Research</h2>
            <p className="text-gray-600">Latest peer-reviewed studies and findings</p>
          </div>
          <button
            onClick={() => onNavigate('research')}
            className="text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {loading && featuredStudies.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading research data...</p>
          </div>
        ) : featuredStudies.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No research data available. Please ensure the backend is running.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStudies.map((study) => (
              <ResearchCard
                key={study.id}
                title={study.title}
                category={study.category}
                summary={study.description || study.summary}
                thumbnail={study.thumbnail}
                tags={study.tags}
                year={study.year}
                onClick={() => onNavigate('detail', study.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Statistics Section */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl text-green-600 mb-2">{stats.papers}</div>
              <div className="text-gray-600">Research Papers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-green-600 mb-2">{stats.researchers}</div>
              <div className="text-gray-600">Active Researchers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-green-600 mb-2">{stats.countries}</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-green-600 mb-2">{stats.dataPoints.toLocaleString()}</div>
              <div className="text-gray-600">Data Points</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action / Subscription */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-center text-white">
          <Mail className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl mb-4">Stay Updated</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Subscribe to receive updates on the latest biological research, data insights, and platform features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="px-6 py-3 bg-white text-green-600 hover:bg-gray-100 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
