const company = require('../db/company');

function generateKey() {
	var d = new Date().getTime();
	
	var key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});

    return key;
};

function validateCompanyKey(req, res, next){
    const companyKey = req.headers['company-api-key'];
    if(!companyKey) return res.status(401).send('Access Denied');
    company.getCompanyApiKey(companyKey).then(company => {
        if(company.length == 0) return res.status(403).send('Invalid Company Key');
        req.company = company;
        next();
    });
}

module.exports = {
    generateKey,
    validateCompanyKey
};