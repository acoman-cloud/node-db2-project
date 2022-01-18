const express = require('express')
const Car = require('./cars-model')
const {
	checkCarId,
	checkCarPayload,
	checkVinNumberValid,
	checkVinNumberUnique,
} = require('./cars-middleware')
const router = express.Router()

router.get('/', (req, res, next) => {
	Car.getAll()
		.then(car => {
			res.json(car)
		})
		.catch(next)
})

router.get('/:id', checkCarId, (req, res, next) => {
	res.json(req.car)
})

router.post('/',
	checkCarPayload,
	checkVinNumberValid,
	checkVinNumberUnique,
	(req, res, next) => {
		Car.create(req.body)
			.then(esp=>{
				res.json(esp)
			})
			.catch(next)
	})

router.use((err, req, res, next) => { // eslint-disable-line
	res.status(err.status || 500).json({
		message: err.message,
		stack: err.stack,
	})
})

module.exports = router
