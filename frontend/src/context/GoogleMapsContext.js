import { createContext, useState } from "react";

const GoogleMapsContext = createContext(null);

export const GoogleMapsProvider = ({ children }) => {
  const [isGoogleMapsApiLoaded, setIsGoogleMapsApiLoaded] = useState(false);

  return (
    <GoogleMapsContext.Provider
      value={{
        isGoogleMapsApiLoaded,
        setIsGoogleMapsApiLoaded,
      }}
    >
      {children}
    </GoogleMapsContext.Provider>
  );
};

export default GoogleMapsContext;
