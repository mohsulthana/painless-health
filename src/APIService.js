var Acuity = require('acuityscheduling')
var userId = '20222948'
var apiKey = '3e13d7077d8f622d5831ba67352be692'

var acuity = Acuity.basic({
  userId: userId,
  apiKey: apiKey
})

acuity.request('/appointments', function (err, res, appointments) {
  if (err) return console.error(err)
  console.log(appointments)
})
