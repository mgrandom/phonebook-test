require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person=require("./models/person")

app.use(express.json());
app.use(express.static('dist'))

morgan.token('type', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :response-time :type'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// app.use(requestLogger)



let numbers =[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person=>{
    response.json(person);
  })
})

app.get("/info",(request,response)=>{
    const time=Date()
    Person.countDocuments().then(numberOfPeople=>{
      response.send(`
        <p>Found info on ${numberOfPeople} people<p/> 
        <p>${time}<p/>
        `);
    })
    

})

app.get("/api/persons/:id",(request,response,next)=>{
  const id=request.params.id;

  Person.findById(id).then(person=>{
    response.json(person);
  }).catch(error=>next(error))
})

app.delete("/api/persons/:id",(request,response,next)=>{
  const id=request.params.id
  numbers=numbers.filter(n=>n.id!==id)
  response.status(204).end();

  Person.findByIdAndDelete(id)
  .then(result=>{
    response.status(204).end()
  }).catch(error=>next(error))
})

app.post("/api/persons",(request,response,next)=>{
  const body=request.body;
  console.log(body.content)
  if (body.name === undefined || body.number===undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person=new Person({
    name:body.name,
    number:body.number
  })

  person.save().then(savedPerson=>{
    response.json(savedPerson);

  }).catch(error=>{next(error)})
  
})

app.put("/api/persons/:id",(request,response,next)=>{
  const {name,number}=request.body

  Person.findByIdAndUpdate(request.params.id,{name,number},{new:true,runValidators:true,context:"query"})
  .then(updatedPerson=>{
    response.json(updatedPerson)
  }).catch(error=>next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);


const errorHandler=(error,request,response,next)=>{
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name ==="ValidationError"){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
  