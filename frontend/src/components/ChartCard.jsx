import { Download, FileDown } from 'lucide-react';

export function ChartCard({ 
  title, 
  children, 
  citation,
  onDownloadData,
  onDownloadFigure 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-gray-900">{title}</h3>
        <div className="flex gap-2">
          {onDownloadData && (
            <button 
              onClick={onDownloadData}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Download Data"
            >
              <FileDown className="w-4 h-4" />
            </button>
          )}
          {onDownloadFigure && (
            <button 
              onClick={onDownloadFigure}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Download Figure"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        {children}
      </div>
      
      {citation && (
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">{citation}</p>
        </div>
      )}
    </div>
  );
}
