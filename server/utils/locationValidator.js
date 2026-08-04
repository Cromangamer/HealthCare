const cities = require("../data/cities");

function normalize(str = "") {
    return str.trim().replace(/\s+/g, " ");
}

function validateLocation(city, state) {
    city = normalize(city);
    state = normalize(state);

    const location = cities.find(
        item =>
            item.name.toLowerCase() === city.toLowerCase() &&
            item.state.toLowerCase() === state.toLowerCase()
    );

    if (!location) {
        throw new Error("Invalid city or state");
    }

    return {
        city: location.name,
        state: location.state,
    };
}

module.exports = validateLocation;