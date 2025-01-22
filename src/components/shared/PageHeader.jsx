const PageHeader = ({ title }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default PageHeader;
