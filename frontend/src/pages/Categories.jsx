import { useState, useEffect } from 'react';
import { Dna, Microscope, Leaf, FlaskConical, Database, Globe, ArrowRight } from 'lucide-react';
import { fetchResearchItems } from '../api';

export function Categories({ onNavigate }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const categoryIcons = {
        'Genomics': Dna,
        'Genetics': Microscope,
        'Agriculture': Leaf,
        'Biology': FlaskConical,
        'Database': Database,
        'Global': Globe,
    };

    const categoryColors = {
        'Genomics': 'bg-blue-50 text-blue-600',
        'Genetics': 'bg-purple-50 text-purple-600',
        'Agriculture': 'bg-green-50 text-green-600',
        'Biology': 'bg-orange-50 text-orange-600',
    };

    useEffect(() => {
        async function loadCategories() {
            try {
                const research = await fetchResearchItems();
                const categoryMap = {};
                research.forEach(item => {
                    const cat = item.category || 'Uncategorized';
                    if (!categoryMap[cat]) {
                        categoryMap[cat] = { count: 0, items: [] };
                    }
                    categoryMap[cat].count++;
                    categoryMap[cat].items.push(item);
                });
                setCategories(Object.entries(categoryMap).map(([name, data]) => ({
                    name,
                    icon: categoryIcons[name] || FlaskConical,
                    color: categoryColors[name] || 'bg-gray-50 text-gray-600',
                    count: data.count,
                    items: data.items.slice(0, 3)
                })));
            } catch (err) {
                console.error('Error loading categories:', err);
            } finally {
                setLoading(false);
            }
        }
        loadCategories();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl text-gray-900 mb-2">Research Categories</h1>
                    <p className="text-xl text-gray-600">Browse research organized by scientific discipline</p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading categories...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {categories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                                <div key={category.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                                                <IconComponent className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl text-gray-900">{category.name}</h2>
                                                <p className="text-gray-600">{category.count} research papers</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onNavigate('research', null, category.name)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            View All
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {category.items.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                                            {category.items.map(item => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => onNavigate('detail', item.id)}
                                                    className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <h3 className="text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                                                    <p className="text-sm text-gray-500">{item.year}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
