const knex = require('./knex');

function createSensor(sensor) {
    return knex('sensor').insert(sensor)
}

function getSensor() {
    return knex('sensor').select("*");
}

function updateSensor(id, sensor) {
    return knex('sensor').where('id', id).update(sensor);
}

function deleteSensor(id) {
    return knex('sensor').where('id', id).del();
}

function getSensorApiKey(key) {
    return knex('sensor').select("sensor_api_key").where('sensor_api_key', key);
}

function getSensorById(id) {
    return knex('sensor').select("*").where('id', id);
}


module.exports = {
    createSensor,
    getSensor,
    deleteSensor,
    updateSensor,
    getSensorApiKey,
    getSensorById
};