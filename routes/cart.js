const {Router} = require('express')
const Course = require('../models/course')
const router = Router()
const auth = require('../middleware/auth')

router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/courses')
})

router.post('/remove', auth, async (req, res) => {
    await req.user.deleteFromCart(req.body.id)

    res.redirect('/cart')
})

router.get('/', auth, async (req, res) => {
    const user = await req.user
    .populate('cart.items.courseId')

    const courses = user.cart.items.map((c) => ({
        ...c.courseId.toJSON(),
        count: c.count
    }))
    
    res.render('cart',
    {
        title: `Cart`,
        courses,
        price: courses.reduce((total, c) => {
            total += c.count*c.price
            return total
        }, 0),
        isCart: true
    })
})

module.exports = router