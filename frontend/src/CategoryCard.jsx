export function CategoryCard({ icon: Icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left group"
    >
      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
      <h3 className="text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}
