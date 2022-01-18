const Car = require('./cars-model')
var vinValidator = require('vin-validator');
const db = require('../../data/db-config')

const checkCarId = async (req, res, next) => {
  const car = await Car.getById(req.params.id)
  if (!car) {
    res.status(404).json({ message: `car with id ${req.params.id} is not found` })
  } else {
    req.car = car
    next()
  }
}

const checkCarPayload = (req, res, next) => {
  const error = { status: 400 }
  const { vin, make, model, mileage } = req.body
  if (vin === undefined) {
    error.message = 'vin is missing'
    next(error)
  } else if (make === undefined) {
    error.message = 'make is missing'
    next(error)
  } else if (model === undefined) {
    error.message = 'model is missing'
    next(error)
  } else if (mileage === undefined) {
    error.message = 'mileage is missing'
    next(error)
  } else {
    next()
  }

  if (error.message) {
    next(error)
  } else {
    next()
  }
}

const checkVinNumberValid = (req, res, next) => {
  const { vin } = req.body
  if (!vinValidator.validate(vin)) {
    next({ status: 400, message: `vin ${vin} is invalid` })
  } else {
    next()
  }
}

const checkVinNumberUnique = async (req, res, next) => {
  const existing = await db('cars').where('vin', req.body.vin).first()
  
  if(existing){
    next({ status: 400, message: `vin ${req.params.vin} already exists`})
  } else {
    next()
  }
}

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
}