const company = require('../db/company');
const sensor = require('../db/sensor');

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
    console.log(companyKey);
    if(!companyKey) return res.status(400).send('Access Denied');
    company.getCompanyApiKey(companyKey).then(company => {
        if(company.length == 0) return res.status(403).send('Invalid Company Key');
        req.company = company;
        next();
    });
}

function validateSensorKey(req, res, next){
    const sensorKey = req.headers['sensor-api-key'];
    if(!sensorKey) return res.status(400).send('Access Denied');
    sensor.getSensorApiKey(sensorKey).then(sensor => {
        if(sensor.length == 0) return res.status(403).send('Invalid Sensor Key');
        req.sensor = sensor;
        next();
    });
}

module.exports = {
    generateKey,
    validateCompanyKey,
    validateSensorKey
};