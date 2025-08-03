import { createContext, useContext } from "react";

type GlobalContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  restaurantId: number | null;
  setRestaurantId: React.Dispatch<React.SetStateAction<number | null>>;
};

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
