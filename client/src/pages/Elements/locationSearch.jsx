import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCities, setLocation } from "../../features/location/getlocation";

function LocationSearch() {
  const dispatch = useDispatch();
  const cities = useSelector((state) => state.ServiceLocation.cities ?? []);
  const selectedCity = useSelector((state) => state.ServiceLocation.selectedCity);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(loadCities());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCity) {
      setSearchTerm(`${selectedCity.name}, ${selectedCity.state}`);
    }
  }, [selectedCity]);

  const filteredCities = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) {
      return cities.slice(0, 8);
    }

    return cities
      .filter((city) => `${city.name}, ${city.state}`.toLowerCase().includes(value))
      .slice(0, 8);
  }, [cities, searchTerm]);

  const handleSelect = (city) => {
    dispatch(setLocation(city));
    setSearchTerm(`${city.name}, ${city.state}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const exactMatch = cities.find(
      (city) => `${city.name}, ${city.state}`.toLowerCase() === searchTerm.trim().toLowerCase(),
    );

    if (exactMatch) {
      handleSelect(exactMatch);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="block text-sm font-semibold text-slate-700">
        Search city and state
      </label>

      <div className="relative">
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Try Mumbai, Maharashtra"
          className="care24-input w-full"
        />

        {searchTerm.trim() && filteredCities.length > 0 && (
          <ul className="care24-card absolute left-0 right-0 top-[calc(100%+0.6rem)] z-10 max-h-56 overflow-auto p-2">
            {filteredCities.map((city) => (
              <li key={city.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(city)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="text-slate-500">{city.state}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-[1.25rem] border border-slate-200 bg-white/80 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">Selected location</p>
          <p className="text-sm text-slate-600">
            {selectedCity
              ? `${selectedCity.name}, ${selectedCity.state}`
              : "Choose a city to discover available services"}
          </p>
        </div>

        <span className={`care24-badge ${selectedCity ? "care24-badge--success" : "care24-badge--warning"}`}>
          {selectedCity ? "Ready to book" : "Pick a city"}
        </span>
      </div>
    </form>
  );
}

export default LocationSearch;