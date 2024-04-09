const connectToDB = require('./dataBase')
const express = require('express')
const cors = require('cors')

connectToDB()

const app = express()
const port = 5000

// middleware
app.use(cors())
app.use(express.json())

// middleware routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})