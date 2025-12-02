import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://restcountries.com/v3.1/independent?status=true');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setCountries(data);
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.error('Error al obtener países:', error);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCountries([]);  
      return;
    }

    let filtered = countries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCountries(filtered);
  }, [searchTerm, countries]);

  return (
    <div className="app">

      {/* ENCABEZADO — SE QUEDA IGUAL */}
      <div className="header">
        <h1>Explorador de Países</h1>
        <p>Descubre información sobre países de todo el mundo</p>
      </div>

      {/* BUSCADOR — SE QUEDA IGUAL */}
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar país..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Cuando no hay búsqueda, no se muestra nada */}
      {!searchTerm && (
        <p style={{ textAlign: 'center', color: '#fff' }}>
          Escribe un país para comenzar la búsqueda
        </p>
      )}

      {loading ? (
        <div className="loading">
          <p>Cargando países...</p>
        </div>
      ) : (
        <div className="countries-grid">
          {Array.isArray(filteredCountries) && filteredCountries.length > 0 ? (
            filteredCountries.map(country => (
              <div
                key={country.cca3}
                onClick={() => setSelectedCountry(country)}
                className="country-card"
              >
                <img
                  src={country.flags.png}
                  alt={`Bandera de ${country.name.common}`}
                  className="flag"
                />
                <div className="card-content">
                  <h3>{country.name.common}</h3>
                  <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
                  <p><strong>Población:</strong> {country.population?.toLocaleString()}</p>
                  <p><strong>Región:</strong> {country.region}</p>
                  <p>
                    <strong>Idiomas:</strong>{' '}
                    {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            searchTerm && (
              <p style={{ color: 'white', textAlign: 'center' }}>
                No se encontraron países
              </p>
            )
          )}
        </div>
      )}

      {/* MODAL */}
      {selectedCountry && (
        <div className="modal-overlay" onClick={() => setSelectedCountry(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <img
                src={selectedCountry.flags.png}
                alt={`Bandera de ${selectedCountry.name.common}`}
                className="modal-flag"
              />
              <button
                onClick={() => setSelectedCountry(null)}
                className="close-btn"
              >
                X
              </button>
            </div>
            <div className="modal-content">
              <h2>{selectedCountry.name.common}</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Nombre oficial</span>
                  <span className="value">{selectedCountry.name.official}</span>
                </div>
                <div className="info-item">
                  <span className="label">Capital</span>
                  <span className="value">{selectedCountry.capital?.[0] || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Región</span>
                  <span className="value">{selectedCountry.region}</span>
                </div>
                <div className="info-item">
                  <span className="label">Subregión</span>
                  <span className="value">{selectedCountry.subregion || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Población</span>
                  <span className="value">{selectedCountry.population?.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Área</span>
                  <span className="value">{selectedCountry.area?.toLocaleString()} km²</span>
                </div>
                <div className="info-item">
                  <span className="label">Idiomas</span>
                  <span className="value">
                    {selectedCountry.languages
                      ? Object.values(selectedCountry.languages).join(', ')
                      : 'N/A'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Moneda</span>
                  <span className="value">
                    {selectedCountry.currencies
                      ? Object.values(selectedCountry.currencies)
                          .map(c => c.name)
                          .join(', ')
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
