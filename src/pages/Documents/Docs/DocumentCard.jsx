const DocumentCard = ({ type, Icon, label, isSelected, onClick, theme }) => (
  <button
    onClick={() => onClick(type)}
    className={`card bg-base-100 hover:bg-base-100/80 transition-all duration-200 cursor-pointer p-4
      ${isSelected 
        ? `border-2 border-primary shadow-lg shadow-primary/20 bg-primary/5` 
        : 'border border-base-300 hover:border-base-content/20'}`}
  >
    <div className="flex flex-col items-center gap-3">
      <Icon 
        className={`w-6 h-6 ${isSelected 
          ? `text-primary` 
          : 'text-base-content/70'}`} 
      />
      <span 
        className={`font-medium text-sm ${isSelected 
          ? `text-primary` 
          : 'text-base-content/80'}`}
      >
        {label}
      </span>
    </div>
  </button>
);

export default DocumentCard;