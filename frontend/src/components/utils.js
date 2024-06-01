export const geolocationOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10000,
};

export const getUserAddressFromLatLng = async (latitude, longitude) => {
  const reverseGeocodingAPIEndPoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}
    &location_type=ROOFTOP&result_type=street_address&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
  return fetch(reverseGeocodingAPIEndPoint)
    .then((response) => response.json())
    .then((location) => {
      const address = location.results[0]?.formatted_address;
      return address;
    });
};

export const calculateTotalQuantity = (cartItems) => {
  return cartItems?.reduce((total, item) => total + item.quantity, 0);
};
