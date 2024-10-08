const mongoose = require('mongoose')

const url =
"mongodb+srv://meritongigollaj:superkonzum@cluster0.vwxsl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length>3) {
    const name=process.argv[2]
    const number=process.argv[3]

    const person = new Person({
        name,
        number
    })

    person.save().then(result => {
        console.log(`Added person ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close();
    })   
}

else if(process.argv.length<3){
    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(person => {
            console.log(person.name,person.number)
        })
        mongoose.connection.close()
      })
}

