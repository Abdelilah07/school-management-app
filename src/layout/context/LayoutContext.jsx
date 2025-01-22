import { createContext, useState, useEffect, useMemo } from 'react';

// Create LayoutContext
export const LayoutContext = createContext();

// LayoutProvider component
export const LayoutProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  // Handle screen resize
  useEffect(() => {
    const debounce = (func, delay) => {
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
      };
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  const contextValue = useMemo(
    () => ({ isSidebarOpen, setIsSidebarOpen, isMobile }),
    [isSidebarOpen, isMobile]
  );

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
};
