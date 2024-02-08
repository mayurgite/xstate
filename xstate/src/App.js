import React, { useState, useEffect } from 'react';

function LocationSelector() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    // Fetch all countries on initial render
    setLoadingCountries(true);
    fetch('https://crio-location-selector.onrender.com/countries')
      .then(response => response.json())
      .then(data => {
        setCountries(data);
        setLoadingCountries(false);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setLoadingCountries(false);
      });
  }, []);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCity('');
    setLoadingStates(true);
    fetch(`https://crio-location-selector.onrender.com/country=${country}/states`)
      .then(response => response.json())
      .then(data => {
        setStates(data);
        setLoadingStates(false);
      })
      .catch(error => {
        console.error('Error fetching states:', error);
        setLoadingStates(false);
      });
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedCity('');
    setLoadingCities(true);
    fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`)
      .then(response => response.json())
      .then(data => {
        setCities(data);
        setLoadingCities(false);
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
        setLoadingCities(false);
      });
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  return (
    <div>
      <select value={selectedCountry} onChange={(e) => handleCountryChange(e.target.value)} disabled={loadingCountries}>
        <option value="">Select Country</option>
        {countries.map(country => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>
      <select value={selectedState} onChange={(e) => handleStateChange(e.target.value)} disabled={!selectedCountry || loadingStates}>
        <option value="">Select State</option>
        {states.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>
      <select value={selectedCity} onChange={(e) => handleCityChange(e.target.value)} disabled={!selectedState || loadingCities}>
        <option value="">Select City</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      {selectedCity && (
        <p>You selected {selectedCity}, {selectedState}, {selectedCountry}</p>
      )}
    </div>
  );
}

export default LocationSelector;
