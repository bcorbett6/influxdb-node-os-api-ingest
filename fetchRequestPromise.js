const axios = require('axios');
require('dotenv').config();
let fetchUrl = process.env.FETCH_URL;

// GET variables for testing
// const { getUnixTime, sub } = require('date-fns');
// const dateTo = getUnixTime(Date.now());
// const dateFrom = getUnixTime(sub(Date.now(), { hours: 100 }));
// const parameters = "&parameter=pm10";
// const cities = "&city=London";

// Non Paginated Version of Request - ONLY ALLOW ONE FUNCTION TO BE EXPORTED
async function fetchRequest(dateFrom, dateTo, parameters, cities) {
  try {
    const res = await axios.get(`${fetchUrl}date_from=${dateFrom}&date_to=${dateTo}&limit=10000&page=1&offset=0&sort=desc&order_by=datetime&${parameters}&${cities}`);
    console.log(`Fetch Status: ${res.status}`);
    // console.log(res.data.results);
    return res.data.results;
  } catch (err) {
    console.error(err)
  }
}

// Paginated Version of request - ONLY ALLOW ONE FUNCTION TO BE EXPORTED
// let arr_result = [];
// let page = 1;
// const limit = 2;

// async function fetchRequest(dateFrom, dateTo, parameters, cities) {
//   try {
//     res = await axios.get(`${fetchUrl}date_from=${dateFrom}&date_to=${dateTo}&limit=${limit}&page=${page}&sort=desc&order_by=datetime&${parameters}&${cities}`);
//     result = res.data.results;
//     arr_result = arr_result.concat(result);
//     page += 1;
//     if (result.length < limit) {
//       console.log(arr_result);
//       return arr_result;
//     } else {
//       fetchRequest(dateFrom, dateTo, parameters, cities);
//     }
//   } catch (err) {
//     console.error(err)
//   }
// }

// fetchRequest(dateFrom, dateTo, parameters, cities);
module.exports = fetchRequest;