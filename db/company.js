const knex = require('./knex');

function createCompany(company) {
    return knex('company').insert(company)
}

function getCompany() {
    return knex('company').select("*");
}

function updateCompany(id, company) {
    return knex('company').where('id', id).update(company);
}

function deleteCompany(id) {
    return knex('company').where('id', id).del();
}

function getCompanyApiKey(key) {
    return knex('company').select("company_api_key").where('company_api_key', key);
}

module.exports = {
    createCompany,
    getCompany,
    deleteCompany,
    updateCompany,
    getCompanyApiKey
};
