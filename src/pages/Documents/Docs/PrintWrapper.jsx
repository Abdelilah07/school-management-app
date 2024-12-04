import React, { forwardRef } from 'react';
import { Printer } from 'lucide-react';

const PrintWrapper = forwardRef(({ onPrint, children }, ref) => (
  <div className="w-1/2 p-8 overflow-y-auto">
    <button
      onClick={onPrint}
      className="w-full mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 print:hidden"
    >
      <Printer className="w-5 h-5" />
      <span>Imprimer le document</span>
    </button>
    <div ref={ref} className="print-content">
      {children}
    </div>
  </div>
));

PrintWrapper.displayName = 'PrintWrapper';

export default PrintWrapper;