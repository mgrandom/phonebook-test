const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

console.log('connecting to mongodb',)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: {
      type:String,
      minLength: 3,
    },
    number: {
      type:String,
      minLength:8,
      validate:{
        validator:function(v){
          return /^\d{2,3}-/.test(v)
        },
        message:"Number must be formated this way *2 or 3 digits*-*rest of number*"
      }
    }
  }) 
  
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)