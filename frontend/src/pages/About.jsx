import { Mail, Github, Globe, Users, Database, Award } from 'lucide-react';

export function About({ onNavigate }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl mb-4">About Biology in Data</h1>
                    <p className="text-xl text-gray-300 max-w-3xl">
                        A comprehensive, open-source platform for biological research data, designed to accelerate scientific discovery through data sharing and visualization.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Mission */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                    <h2 className="text-3xl text-gray-900 mb-4">Our Mission</h2>
                    <p className="text-gray-700 text-xl mb-4">
                        We believe that open access to biological research data can transform the pace of scientific discovery.
                        Biology in Data provides a platform for researchers to share, discover, and visualize complex datasets
                        from genomics, genetics, agriculture, and other biological sciences.
                    </p>
                    <p className="text-gray-600">
                        Our goal is to make biological data accessible to researchers, students, and curious minds worldwide,
                        fostering collaboration and accelerating breakthroughs in understanding life.
                    </p>
                </section>

                {/* Features */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <Database className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl text-gray-900 mb-2">Open Data</h3>
                        <p className="text-gray-600">Access curated biological datasets from research institutions worldwide.</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl text-gray-900 mb-2">Community Driven</h3>
                        <p className="text-gray-600">Researchers can contribute their data and findings to benefit the community.</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <Award className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl text-gray-900 mb-2">Quality Assured</h3>
                        <p className="text-gray-600">All submissions are reviewed for scientific rigor and data integrity.</p>
                    </div>
                </section>

                {/* Contact */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-3xl text-gray-900 mb-4">Get in Touch</h2>
                    <p className="text-gray-600 mb-6">
                        Have questions, suggestions, or want to contribute? We'd love to hear from you.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a href="mailto:contact@biologyindata.org" className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                            <Mail className="w-5 h-5" />
                            Email Us
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                            <Github className="w-5 h-5" />
                            GitHub
                        </a>
                        <button onClick={() => onNavigate('research')} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                            <Globe className="w-5 h-5" />
                            Explore Research
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
