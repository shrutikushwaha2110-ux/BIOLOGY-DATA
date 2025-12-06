import { useState, useEffect } from 'react';
import { Download, FileText, Share2, BookOpen, Loader } from 'lucide-react';
import { ChartCard } from '../components/ChartCard';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { fetchResearchById, fetchRawData } from '../api';

export function ResearchDetail({ onNavigate, researchId = 'genome_cost' }) {
  const [research, setResearch] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map research IDs to their corresponding raw data files
  const dataFileMapping = {
    'genome_cost': 'Sequencing_Cost_Data_Table_May2022_NHGRI.json',
    'genome_projects': 'national_genome_projects.json',
    'gwas_diversity': 'gwas_catalog-ancestry_r2025-04-14.json',
    'pbw_damage_cotton_india': 'PBW_resistance_damage_Bt_cotton.json'
  };

  // Fetch research data on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Fetch research metadata
        const researchData = await fetchResearchById(researchId);
        setResearch(researchData);

        // Try to load corresponding raw data file
        const dataFile = dataFileMapping[researchId];
        if (dataFile) {
          try {
            const rawData = await fetchRawData(dataFile);
            // Process raw data for charts
            setChartData(Array.isArray(rawData) ? rawData.slice(0, 50) : []);
          } catch (dataErr) {
            console.warn('Could not load raw data:', dataErr);
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error loading research:', err);
        setError('Failed to load research data. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [researchId]);

  const handleDownloadData = () => {
    const dataFile = dataFileMapping[researchId];
    if (dataFile) {
      window.open(`http://localhost:5000/api/data/${encodeURIComponent(dataFile)}`, '_blank');
    }
  };

  const handleDownloadFigure = () => {
    console.log('Downloading figure...');
  };

  // Format number for display
  const formatNumber = (num) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  // Get chart type based on research ID
  const getChartComponent = () => {
    if (!chartData || chartData.length === 0) return null;

    if (researchId === 'genome_cost') {
      // Genome cost: line chart showing cost over time
      const formattedData = chartData.map(item => ({
        date: item.Date || '',
        costPerGenome: item['Cost per Genome'] || 0,
        costPerMb: item['Cost per Mb'] || 0
      }));

      return (
        <ChartCard
          title="Genome Sequencing Cost Over Time"
          citation="Data source: NHGRI - Cost of sequencing a human genome from 2001 to 2022"
          onDownloadData={handleDownloadData}
          onDownloadFigure={handleDownloadFigure}
        >
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 10 }} interval={5} />
              <YAxis
                stroke="#6b7280"
                tickFormatter={formatNumber}
                label={{ value: 'Cost (USD)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend />
              <Line type="monotone" dataKey="costPerGenome" stroke="#4CAF50" strokeWidth={2} name="Cost per Genome" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      );
    }

    if (researchId === 'genome_projects') {
      // Genome projects: bar chart by country
      const countryCounts = {};
      chartData.forEach(item => {
        const country = item['Country/Region'] || 'Unknown';
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      });
      const barData = Object.entries(countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

      return (
        <ChartCard
          title="National Genome Projects by Country"
          citation="Data source: Survey of national genome initiatives worldwide"
          onDownloadData={handleDownloadData}
          onDownloadFigure={handleDownloadFigure}
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="country" stroke="#6b7280" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#6b7280" label={{ value: 'Number of Projects', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#4CAF50" name="Projects" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      );
    }

    // Default: show raw data table
    return (
      <ChartCard
        title="Dataset Overview"
        citation={`Showing first ${Math.min(chartData.length, 10)} records`}
        onDownloadData={handleDownloadData}
        onDownloadFigure={handleDownloadFigure}
      >
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {chartData[0] && Object.keys(chartData[0]).slice(0, 6).map(key => (
                  <th key={key} className="px-4 py-2 text-left text-gray-700 font-medium">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.slice(0, 10).map((row, i) => (
                <tr key={i} className="border-t">
                  {Object.values(row).slice(0, 6).map((val, j) => (
                    <td key={j} className="px-4 py-2 text-gray-600">{String(val).slice(0, 50)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading research data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => onNavigate('research')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Research
          </button>
        </div>
      </div>
    );
  }

  // Parse metadata if it's an array (our metadata format)
  const metadata = Array.isArray(research) && research.length > 2 ? research[2] : research;
  const title = metadata?.Column2 || metadata?.Column4 || metadata?.title || researchId.replace(/_/g, ' ');
  const description = metadata?.description || metadata?.Column5 || '';
  const authors = metadata?.citation || metadata?.Column9 || '';
  const journal = metadata?.Column11 || metadata?.Column15 || '';
  const year = metadata?.Column12 || metadata?.Column16 || '';
  const doi = metadata?.Column13 || metadata?.Column17 || '';
  const sourceUrl = metadata?.Column4 || metadata?.Column3 || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate('home')} className="hover:text-gray-900">Home</button>
            <span>/</span>
            <button onClick={() => onNavigate('research')} className="hover:text-gray-900">Research</button>
            <span>/</span>
            <span className="text-gray-900">Study Details</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              Genetics
            </span>
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h1 className="text-4xl text-gray-900 mb-4">
            {title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <span>Authors:</span>
              <span className="text-gray-900">Chen, L., Wang, M., Rodriguez, A., Patel, S.</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Published:</span>
              <span className="text-gray-900">March 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <span>DOI:</span>
              <span className="text-green-600 hover:underline cursor-pointer">10.1234/bio.2024.5678</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {['CRISPR', 'Gene Editing', 'Stem Cells', 'Molecular Biology', 'Genetic Engineering'].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          <div className="h-64 mb-6 rounded-lg overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1579154392013-64f6ab5c2aa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW5ldGljcyUyMHJlc2VhcmNofGVufDF8fHx8MTc2NDMwMTgwMnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Genetics Research"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 mb-4">
              {description || 'No description available for this dataset.'}
            </p>
          </div>
        </div>

        {/* Main Content with Charts */}
        <div className="space-y-8">
          <h2 className="text-3xl text-gray-900">Data Visualization</h2>

          {/* Dynamic Chart based on research type */}
          {getChartComponent()}

          {!chartData.length && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500">No chart data available for this dataset.</p>
              <button
                onClick={handleDownloadData}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Download Raw Data
              </button>
            </div>
          )}


          {/* Key Findings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl text-gray-900 mb-6">Key Findings</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">1</div>
                <div>
                  <h3 className="text-gray-900 mb-1">High Efficiency Achieved</h3>
                  <p className="text-gray-600">Average editing efficiency of 88% across all target sites, with optimal sites reaching 98% success rates.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">2</div>
                <div>
                  <h3 className="text-gray-900 mb-1">Gene Expression Correlation</h3>
                  <p className="text-gray-600">Strong positive correlation (R² = 0.92) between target gene expression levels and editing efficiency.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">3</div>
                <div>
                  <h3 className="text-gray-900 mb-1">Stable Cell Lines</h3>
                  <p className="text-gray-600">Successfully edited cells maintained pluripotency and showed normal growth patterns over 6 weeks.</p>
                </div>
              </div>
            </div>
          </div>

          {/* References */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl text-gray-900 mb-6">References</h2>
            <ol className="space-y-3 text-sm text-gray-700">
              <li>1. Jinek, M., et al. (2012). A programmable dual-RNA-guided DNA endonuclease in adaptive bacterial immunity. <em>Science</em>, 337(6096), 816-821.</li>
              <li>2. Ran, F. A., et al. (2013). Genome engineering using the CRISPR-Cas9 system. <em>Nature Protocols</em>, 8(11), 2281-2308.</li>
              <li>3. Hsu, P. D., et al. (2014). Development and applications of CRISPR-Cas9 for genome engineering. <em>Cell</em>, 157(6), 1262-1278.</li>
              <li>4. Wang, T., et al. (2019). Genetic screens in human cells using the CRISPR-Cas9 system. <em>Science</em>, 343(6166), 80-84.</li>
              <li>5. Komor, A. C., et al. (2016). Programmable editing of a target base in genomic DNA without double-stranded DNA cleavage. <em>Nature</em>, 533(7603), 420-424.</li>
            </ol>
          </div>

          {/* Citation Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 text-white">
            <div className="flex items-start gap-4">
              <BookOpen className="w-6 h-6 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl mb-3">Cite This Study</h3>
                <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm">
                  Chen, L., Wang, M., Rodriguez, A., & Patel, S. (2024). CRISPR-Cas9 Gene Editing Efficiency in Human Embryonic Stem Cells. <em>Biology in Data</em>. DOI: 10.1234/bio.2024.5678
                </div>
                <button className="mt-4 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Copy Citation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
