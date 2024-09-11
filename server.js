const express = require('express')

const fs = require('fs')

//Create the Express Web API application
const app = express()

//The app will parse the request body as json
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//The app will listen to process.env.PORT or port 5000
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server started on port ${port}.`)
})


//The API is used to save booking details and update seats 
//availability for the booked screen time of the movie
app.post('/api/booking', (req, res) => {
  //The bookings.json file path
  const bookingFilePath = './data/bookings.json'

  //Load the bookings.json file contents
  const bookingContents = JSON.parse(
    fs.readFileSync(bookingFilePath, {
      encoding: 'utf-8',
      flag: 'r',
    })
  )

  //Add the new booking to the bookingContents array
  bookingContents.push(req.body)

  //Overwrite the bookings.json file with the updated bookingContents
  fs.writeFileSync(bookingFilePath, JSON.stringify(bookingContents), {
    encoding: 'utf-8',
    flag: 'w',
  })

  //The path of the file MovieSchedule.json
  const scheduleFilePath = '../onlineticketbooking/src/data/MovieSchedule.json'

  //Load the file
  const scheduleFileContents = JSON.parse(
    fs.readFileSync(scheduleFilePath, {
      encoding: 'utf-8',
      flag: 'r',
    })
  )

  //Get the seats array of the screen time of the movie
  let seats = scheduleFileContents.schedules
    .find((s) => s.movieId.toString() === req.body.movieId)
    .screenTimes.find((s) => s.id.toString() === req.body.screenId).seats

  //Remove the booked seat from the array
  seats.splice(seats.indexOf(req.body.seat), 1)

  //Overwrite the MovieSchedule.json file with the scheduleFileContents
  fs.writeFileSync(scheduleFilePath, JSON.stringify(scheduleFileContents), {
    encoding: 'utf-8',
    flag: 'w',
  })

  //Return the response
  res.send(
    'The booking details have been saved, and the seats availability has been updated.'
  )
})

//The API to save the contact us records submitted from users
app.post('/api/contactus', (req, res) => {

  const filePath = './data/contactus.json'

  //Load the contactus.json file contents
  const fileContents = JSON.parse(
    fs.readFileSync(filePath, {
      encoding: 'utf-8',
      flag: 'r',
    })
  )

  //Add the submitted contact us records to the contents
  fileContents.push(req.body)

  //Save the contents with the new record to the contact.json file
  fs.writeFileSync(filePath, JSON.stringify(fileContents), {
    encoding: 'utf-8',
    flag: 'w',
  })

  res.send('The contact us record have been received successfully.')
})
