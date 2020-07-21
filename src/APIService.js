var Acuity = require('acuityscheduling')
var userId = '19999934'
var apiKey = '3c93bb0252d53b684f1fb6291644d72d'

var acuity = Acuity.basic({
  userId: userId,
  apiKey: apiKey
})

acuity.request('/appointments', function (err, res, appointments) {
  if (err) return console.error(err)
  console.log(appointments)
})
