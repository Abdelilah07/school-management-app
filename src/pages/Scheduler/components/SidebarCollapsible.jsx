import React from "react";
import { ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState, useEffect, useRef } from "react";

const SidebarContext = createContext();

export default function SidebarCollapsible({ children }) {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setExpanded(false);
        setActiveSection(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className={`fixed right-4 top-[5.5rem] z-50 
        ${expanded ? "w-80" : "w-16"} 
        h-[calc(100vh-6.5rem)] 
        transition-all duration-300 ease-in-out
        bg-base-100
        rounded-2xl
        border border-base-300
        shadow-lg backdrop-blur-sm
        overflow-hidden`}
    >
      <nav className="h-full flex flex-col">
        <div className={`p-4 flex ${!expanded ? "justify-center" : "justify-between"} items-center border-b border-base-300`}>
          <div className={`flex items-center ${!expanded && "scale-0 w-0"} transition-transform duration-300`}>
            <span className="text-lg font-semibold text-base-content">Menu</span>
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-2 rounded-lg hover:bg-base-200
              transition-colors duration-300"
          >
            {expanded ? (
              <ChevronLast className="text-base-content" />
            ) : (
              <ChevronFirst className="text-base-content" />
            )}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded, reset: !expanded, activeSection, setActiveSection }}>
          <ul className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300">
            {children}
          </ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, children, id }) {
  const { expanded, reset, activeSection, setActiveSection } = useContext(SidebarContext);
  const isOpen = activeSection === id;

  const handleToggle = () => {
    if (!reset) {
      setActiveSection(isOpen ? null : id);
    }
  };

  if (reset && isOpen) {
    setActiveSection(null);
  }

  return (
    <li className="relative group">
      <div
        className={`flex justify-center items-center py-3 px-3 rounded-lg cursor-pointer
          transition-all duration-300 group-hover:shadow-md
          ${isOpen 
            ? 'bg-primary/15 text-primary shadow-md' 
            : 'text-base-content hover:bg-base-200'
          }`}
        onClick={handleToggle}
      >
        <div className="w-auto transition-transform group-hover:scale-110">
          {React.cloneElement(icon, {
            size: 20,
            className: `transition-colors ${isOpen ? 'text-primary' : ''}`
          })}
        </div>
        <span
          className={`overflow-hidden transition-all duration-300
            ${expanded ? "w-52 ml-4 opacity-100" : "w-0 opacity-0"}`}
        >
          {text}
        </span>
      </div>
      {isOpen && expanded && (
        <div className="mt-2 mx-2 px-4 py-3 text-sm text-base-content/80
          bg-base-200/50 rounded-lg
          animate-fadeIn">
          {children}
        </div>
      )}
    </li>
  );
}
