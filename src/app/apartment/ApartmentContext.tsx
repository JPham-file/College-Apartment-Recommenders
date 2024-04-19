// ApartmentContext.tsx
import React, { useState, ReactNode } from 'react';
import { createContext } from 'react';
import { ApartmentUnitRecommendation } from '@/src/types';

interface ApartmentContextData {
  apartment: ApartmentUnitRecommendation | null;
  setApartment: (apartment: ApartmentUnitRecommendation | null) => void;
}

export const ApartmentContext = createContext<ApartmentContextData>({
  apartment: null,
  setApartment: () => {},
});



interface ApartmentProviderProps {
    children: ReactNode;
  }
  
  export const ApartmentProvider: React.FC<ApartmentProviderProps> = ({ children }) => {
    const [apartment, setApartment] = useState<ApartmentUnitRecommendation | null>(null);
  
    return (
      <ApartmentContext.Provider value={{ apartment, setApartment }}>
        {children}
      </ApartmentContext.Provider>
    );
  };