const knex = require('./knex');

function createLocation(location) {
    return knex('location').insert(location);
}

function getLocations() {
    return knex('location').select("*");
}

function updateLocation(id, location) {
    return knex('location').where('id', id).update(location);
}

function deleteLocation(id) {
    return knex('location').where('id', id).del();
}

function getLocationById(id) {
    return knex('location').select("*").where('id', id);
}


module.exports = {
    createLocation,
    getLocations,
    deleteLocation,
    updateLocation,
    getLocationById
};