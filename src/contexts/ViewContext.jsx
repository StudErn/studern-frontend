import React, { createContext, useContext, useState, useEffect } from 'react';

const ViewContext = createContext();

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
};

export const ViewProvider = ({ children }) => {
  const [selectedView, setSelectedView] = useState('applicant'); // Default to applicant view

  // Load selected view from localStorage on mount
  useEffect(() => {
    const storedView = localStorage.getItem('selectedView');
    if (storedView) {
      setSelectedView(storedView);
    }
  }, []);

  // Save selected view to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedView', selectedView);
  }, [selectedView]);

  const changeView = (view) => {
    setSelectedView(view);
  };

  const value = {
    selectedView,
    changeView,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};