import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadCities, setLocation } from "../../features/location/getlocation";

function LocationSearch() {
  const dispatch = useDispatch();

  const cities = useSelector((state) => state.ServiceLocation.cities);
    const [search , setSearch] = useState("");
  useEffect(() => {
    dispatch(loadCities());
  }, [dispatch]);
  return (
    <>
      <div>
        <h2>Services</h2>

        <input
          list="cities"
          placeholder="Search city..."
          className="border rounded p-2 w-full"
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);

            const city = cities.find(
            (c) => `${c.name}, ${c.state}` === value
            );

            if (city) {
            dispatch(setLocation(city));
            }
        }}
        />

        <datalist id="cities">
          {cities.map((city) => (
            <option key={city.id} value={`${city.name}, ${city.state}`} />
          ))}
        </datalist>


      </div>
    </>
  );
}

export default LocationSearch;