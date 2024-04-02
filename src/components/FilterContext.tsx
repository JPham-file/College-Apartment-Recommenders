import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  filterOption: string;
  setFilterOption: (option: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [filterOption, setFilterOption] = useState('Show All');

  return (
    <FilterContext.Provider value={{ filterOption, setFilterOption }}>
  {children}
  </FilterContext.Provider>
);
};
