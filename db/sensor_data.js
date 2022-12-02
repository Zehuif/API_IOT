const knex = require('./knex');

function createSensorData(SensorData) {
    return knex('sensor_data').insert(SensorData)
}

function getSensorData() {
    return knex('sensor_data').select("*");
}

function updateSensorData(id, SensorData) {
    return knex('sensor_data').where('id', id).update(SensorData);
}

function deleteSensorData(id) {
    return knex('sensor_data').where('id', id).del();
}

function getSensorDataPersonalized(from, to, sensor_id) {
    return knex('sensor_data').select("*").whereBetween('timestamp', [from, to]).andWhere('sensor_id', sensor_id);
}

function getSensorDataById(id) {
    return knex('sensor_data').select("*").where('id', id);
}

module.exports = {
    createSensorData,
    getSensorData,
    deleteSensorData,
    updateSensorData,
    getSensorDataPersonalized,
    getSensorDataById
};