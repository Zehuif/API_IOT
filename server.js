const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const locations = require('./db/location');
const sensors = require('./db/sensor');
const admin = require('./db/admin');
const company = require('./db/company');
const sensor_data = require('./db/sensor_data');
const key = require('./key/api-key');
const token = require('./token/token');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

//admin
app.get('/admin', (req, res) => {
    admin.getAdmin().then(admin => {
        res.status(200).send(admin);
    });
});
app.post('/admin', async(req, res) => {
    await admin.login(req.body).then(user => {
        if(user.length > 0){
            const accessToken = token.generateAccessToken({ username: user[0].Username });
            res.header('authorization', accessToken).json({ accessToken: accessToken });
        }else{
            res.status(404).send('Not Found');
        }
    });
});

//company
app.get('/company', (req, res) => {
    company.getCompany().then(company => {
        res.status(200).send(company);
    });
});
app.post('/company',token.validateToken, (req, res) => {
    const newKey = key.generateKey();
    const newCompany = {
        company_name: req.body.company_name,
        company_api_key: newKey
    };
    company.createCompany(newCompany).then(company => {
        res.status(201).json({ ID: company[0], company_api_key: newKey });
    });
});

//locations
app.get('/location',key.validateCompanyKey, (req, res) => {
    locations.getLocations().then(locations => {
        res.status(200).send(locations);
    });
});

app.post('/location',token.validateToken, key.validateCompanyKey, async (req, res) => {
    await locations.createLocation(req.body).then(location => {
        res.status(201).json({ 
            ID: location[0], 
            company_id: req.body.company_id,
            location_name: req.body.location_name, 
            location_country: req.body.location_country, 
            location_city: req.body.location_city, 
            location_meta: req.body.location_meta });
    });
});

app.put('/location/:id', key.validateCompanyKey, async (req, res) => {
    await locations.updateLocation(req.params.id, req.body).then(location => {
        res.status(200).json({ message: 'Location updated' });
    });
});

app.delete('/location/:id', key.validateCompanyKey, async (req, res) => {
    await locations.deleteLocation(req.params.id).then(location => {
        res.status(200).json({ message: 'Location deleted' });
    });
});

//sensors
app.get('/sensor', key.validateCompanyKey, (req, res) => {
    sensors.getSensor().then(sensors => {
        res.status(200).send(sensors);
    });
});

app.post('/sensor', key.validateCompanyKey, token.validateToken, async (req, res) => {
    const newSensor = {
        location_id: req.body.location_id,
        sensor_name: req.body.sensor_name,
        sensor_category: req.body.sensor_category,
        sensor_meta: req.body.sensor_meta,
        sensor_api_key: key.generateKey()
    };
    await sensors.createSensor(newSensor).then(sensor => {
        //res.status(201).json({ ID: sensor[0], admin_name: req.user.username ,company_api_key: req.company[0].company_api_key});
        res.status(201).json({ ID: sensor[0], sensor_api_key: newSensor.sensor_api_key });
    });
});

app.put('/sensor/:id', key.validateCompanyKey, async (req, res) => {
    await sensors.updateSensor(req.params.id, req.body).then(sensor => {
        res.status(200).json({ message: 'Sensor updated' });
    });
});

app.delete('/sensor/:id', key.validateCompanyKey, async (req, res) => {
    await sensors.deleteSensor(req.params.id).then(sensor => {
        res.status(200).json({ message: 'Sensor deleted' });
    });
});

//sensor data
app.get('/sensordata', key.validateSensorKey, (req, res) => {
    sensor_data.getSensorData().then(sensors => {
        res.status(200).send(sensors);
    });
});

app.post('/sensordata', key.validateSensorKey, async (req, res) => {
    //console.log(req.body.json_data[0]);
    var aux = 0;
    data = req.body.json_data;
    data.forEach(async element => {
        const newSensorData = {
            sensor_id: element.sensor_id,
            data: element.data,
            X: element.x,
            Y: element.y,
            timestamp: Date.now()
        };
        await sensor_data.createSensorData(newSensorData).then( ()=> {  
            aux++;
            if(aux == data.length){
                res.status(201).json({ message: 'Data inserted' });
            }
        });
    });
});

app.put('/sensordata/:id', key.validateSensorKey, async (req, res) => {
    await sensor_data.updateSensorData(req.params.id, req.body).then(sensor => {
        res.status(200).json({ message: 'Sensor data updated' });
    });
});

app.delete('/sensordata/:id', key.validateSensorKey, async (req, res) => {
    await sensor_data.deleteSensorData(req.params.id).then(sensor => {
        res.status(200).json({ message: 'Sensor data deleted' });
    });
});

app.post('/sensor_data', key.validateSensorKey, async (req, res) => { 
    query = new Array();
    req.body.sensor_id.forEach(async element => {
        await sensor_data.getSensorDataPersonalized(req.body.from, req.body.to, element).then(data => {
            query.push(data[0]);
            if(query.length == req.body.sensor_id.length){
                console.log(query);            
                res.status(200).json(query);
            };
        });
    });
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});