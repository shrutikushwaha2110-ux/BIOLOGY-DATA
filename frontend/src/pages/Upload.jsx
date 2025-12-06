import { Upload as UploadIcon, FileText, Image, Database, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useState, useRef } from 'react';

export function Upload({ onNavigate }) {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    abstract: '',
    tags: '',
    category: '',
    year: new Date().getFullYear().toString(),
    doi: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [datasetFile, setDatasetFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [paperFile, setPaperFile] = useState(null);

  const datasetInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const paperInputRef = useRef(null);

  const categories = [
    'Select Category',
    'Genetics',
    'Microbiology',
    'Ecology',
    'Biotechnology',
    'Neuroscience',
    'Immunology',
    'Biochemistry',
    'Cell Biology',
    'Molecular Biology'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          authors: formData.authors,
          abstract: formData.abstract,
          tags: formData.tags,
          category: formData.category,
          year: formData.year,
          doi: formData.doi
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Research "${formData.title}" uploaded successfully!` });
        // Reset form
        setFormData({
          title: '', authors: '', abstract: '', tags: '', category: '',
          year: new Date().getFullYear().toString(), doi: ''
        });
        // Redirect to research listing after 2 seconds
        setTimeout(() => onNavigate('research'), 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to upload research' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error: Could not connect to server' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl text-gray-900 mb-2">Upload Research Study</h1>
          <p className="text-xl text-gray-600">Share your research with the scientific community</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-blue-900 mb-1">Submission Guidelines</h3>
            <p className="text-sm text-blue-700">
              All submissions are reviewed for quality and relevance. Please ensure your research is peer-reviewed
              and includes proper citations. Data should be anonymized and comply with ethical standards.
            </p>
          </div>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`rounded-xl p-4 mb-8 flex gap-3 ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>{message.text}</p>
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-900 mb-2">
                Research Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter the full title of your research"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Authors */}
            <div>
              <label className="block text-gray-900 mb-2">
                Authors *
              </label>
              <input
                type="text"
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                placeholder="e.g., Smith, J., Doe, A., Johnson, K."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Separate multiple authors with commas</p>
            </div>

            {/* Category and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-900 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category === 'Select Category' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-900 mb-2">
                  Publication Year *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-gray-900 mb-2">
                Abstract *
              </label>
              <textarea
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                placeholder="Provide a detailed abstract of your research (minimum 200 words)"
                rows={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.abstract.split(' ').filter(w => w).length} words
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-gray-900 mb-2">
                Tags *
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., CRISPR, Gene Editing, Stem Cells"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Separate tags with commas (minimum 3 tags)</p>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dataset Upload */}
              <div>
                <label className="block text-gray-900 mb-2">
                  Dataset Upload
                </label>
                <div
                  onClick={() => datasetInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer"
                >
                  <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  {datasetFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-green-600">{datasetFile.name}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setDatasetFile(null); }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-1">Upload dataset (CSV, JSON)</p>
                      <p className="text-xs text-gray-500">Max file size: 50MB</p>
                    </>
                  )}
                  <input
                    ref={datasetInputRef}
                    type="file"
                    className="hidden"
                    accept=".csv,.json"
                    onChange={(e) => setDatasetFile(e.target.files[0])}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-900 mb-2">
                  Featured Image
                </label>
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer"
                >
                  <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  {imageFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-green-600">{imageFile.name}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImageFile(null); }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-1">Upload image (PNG, JPG)</p>
                      <p className="text-xs text-gray-500">Max file size: 10MB</p>
                    </>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
              </div>
            </div>

            {/* Full Paper Upload */}
            <div>
              <label className="block text-gray-900 mb-2">
                Full Research Paper (Optional)
              </label>
              <div
                onClick={() => paperInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer"
              >
                <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                {paperFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-green-600">{paperFile.name}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPaperFile(null); }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 mb-1">Upload full paper (PDF)</p>
                    <p className="text-sm text-gray-500 mb-3">Drag and drop or click to browse</p>
                    <span className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm inline-block">
                      Select File
                    </span>
                  </>
                )}
                <input
                  ref={paperInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => setPaperFile(e.target.files[0])}
                />
              </div>
            </div>

            {/* DOI */}
            <div>
              <label className="block text-gray-900 mb-2">
                DOI (Digital Object Identifier)
              </label>
              <input
                type="text"
                placeholder="10.xxxx/xxxxx (if available)"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1" required />
                <span className="text-sm text-gray-700">
                  I confirm that this research is original, has been conducted ethically, and I have the rights to share this data.
                  I agree to the <span className="text-green-600 hover:underline">terms and conditions</span> of Biology in Data.
                </span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <UploadIcon className="w-5 h-5" />
                Submit Research
              </button>
              <button
                type="button"
                onClick={() => onNavigate('research')}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Quality Review</h3>
            <p className="text-sm text-gray-600">All submissions undergo peer review to ensure scientific rigor</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Open Data</h3>
            <p className="text-sm text-gray-600">Share your data openly to advance biological research</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <UploadIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Quick Process</h3>
            <p className="text-sm text-gray-600">Review typically completed within 5-7 business days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
