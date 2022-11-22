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


module.exports = {
    createSensor,
    getSensor,
    deleteSensor,
    updateSensor
};