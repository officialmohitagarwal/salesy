"use client";

import { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);

  return (
    <StoreContext.Provider
      value={{
        customers,
        setCustomers,
        inventory,
        setInventory,
        sales,
        setSales,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);