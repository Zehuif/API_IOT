const knex = require('./knex');

function login(admin) {
    return knex('admin').select('username').where('username', admin.username).andWhere('password', admin.password)

}

function getAdmin() {
    return knex('admin').select("*");
}

module.exports = {
    login,
    getAdmin
};