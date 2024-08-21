const express = require('express')
const app = express()
const morgan = require('morgan')


app.use(express.json());

morgan.token('type', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :response-time :type'))



const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

//app.use(requestLogger)



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
    response.json(numbers)
  })


app.get("/info",(request,response)=>{
    const numberOfPeople=numbers.length;
    const time=Date()

    response.send(`
      <p>Found info on ${numberOfPeople} people<p/> 
      <p>${time}<p/>
      `);

})

app.get("/api/persons/:id",(request,response)=>{
  const id=request.params.id;
  const info=numbers.find(n=>n.id===id)

  if(info){
    response.json(info);
  }else{
    response.status(404).end()
  }
})

app.delete("/api/persons/:id",(request,response)=>{
  const id=request.params.id
  numbers=numbers.filter(n=>n.id!==id)

  response.status(204).end();
})

app.post("/api/persons",(request,response)=>{
  const id=String(Math.floor(Math.random() * 100))
  const info=request.body;
  let found=numbers.find((number)=>{
    return number.name===info.name;
  })

  if(found){
    return response.status(400).json({
      error:"User already exists with this name"
    })
  }

  if (!info.name || !info.number) {
    return response.status(400).json({ 
    error: 'content missing' 
    })
  }

  const number={
    id,
    name:info.name,
    number:info.number
  }

  numbers=numbers.concat(number);
  response.json(number);
  
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
  