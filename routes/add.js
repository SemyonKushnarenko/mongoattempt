const {Router} = require('express')
const Course = require('../models/course')
const router = Router()
const auth = require('../middleware/auth')

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add course page',
        isAdd: true
    })
})

router.post('/', auth, async (req, res) => {
    try {
        const {title, email, img, price} = req.body
        const course = new Course({
            title: title,
            email: email,
            price: price, 
            img: img,
            userId: req.user
        })
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router