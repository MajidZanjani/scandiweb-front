import React, { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MenuContext = createContext();

const MenuProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem("selectedCategory") || "all";
  });

  const location = useLocation();

  useEffect(() => {
    // Extract category from URL
    const path = location.pathname;
    const category = path.split("/")[1] || "all";

    // Update state and localStorage if the category has changed
    if (category !== selectedCategory) {
      setSelectedCategory(category);
      localStorage.setItem("selectedCategory", category);
    }
  }, [location.pathname, selectedCategory]);

  return (
    <MenuContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </MenuContext.Provider>
  );
};

export { MenuContext, MenuProvider };
