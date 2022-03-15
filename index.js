const { formatISO, sub } = require('date-fns');
const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const fetchRequest = require("./fetchRequestPromise");
// require('dotenv').config()

// ENV Variables
let url = process.env.WRITE_URL;
let token = process.env.TOKEN;
let org = process.env.ORG;
let bucket = process.env.BUCKET;
let fetchPeriodHours = process.env.FETCH_PERIOD_HOURS;
let cities = process.env.PARAMETER_SET_1;
let parameters = process.env.PARAMETER_SET_2;

// FETCH Variables
let dateTo = formatISO(Date.now());
let dateFrom = formatISO(sub(Date.now(), { hours: fetchPeriodHours }));

// Fetch data and write to InfluxDB every hour
// async function airQuality() {
exports.handler = async function(event) {

  // Create an array of the desired query parameter
  const cityArray = cities.split('&');
  const cleanCityArray = cityArray.filter(function (res) { return res });

  // Loop through query parameter array
  // fetch data array from open source API
  let fetchData = [];
  try {
    for (let i = 0; i < cleanCityArray.length; i++) {
      fetchData.push(await fetchRequest(dateFrom, dateTo, parameters, cleanCityArray[i]))
    }
    Promise.all(fetchData)
      .then(
        fetchData = fetchData.flat(),
        console.log(fetchData)
      )
      .catch(err => console.log(err))
  } catch (status) {
    console.log("failed w/ status: ", status);
  }

  // write batch to InfluxDB
  const influxDB = new InfluxDB({ url, token });
  const writeApi = influxDB.getWriteApi(org, bucket);
  await fetchData.forEach((item) => {
    const newMeasurement = new Point("airQuality")
      .timestamp(new Date(item.date.utc))
      .tag("location", item.location)
      .tag("country", item.country)
      .tag("city", item.city)
      .floatField(item.parameter, item.value)
      .floatField("lat", item.coordinates.latitude)
      .floatField("lon", item.coordinates.longitude)
      .stringField("unit", item.unit)
    writeApi.writePoint(newMeasurement)
    console.log(` ${newMeasurement}`)
  }
  );

  // Close write to InfluxDB
  try {
    writeApi.close().then(() => {
      console.log('WRITE FINISHED')
    })
  } catch (status) {
    console.log("failed w/ status: ", status);
  }
};
// airQuality();