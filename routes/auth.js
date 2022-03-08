const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.get('/', (req, res) => {
    res.render('auth', {
        title: 'Authentication',
        isAuth: true
    })
})

router.post('/signin', async (req, res) => {
    
    const {email, password} = req.body
    const candidate = await User.findOne({email})

    if (candidate) {
        const areSame = await bcrypt.compare(password, candidate.password)
        if (areSame) {
            req.session.user = candidate
            req.session.isAuthenticated = true
            req.session.save(err => {
                if (err) {
                    throw err
                }
                res.redirect('/')
            })
        }
        else {
            res.redirect('/auth#signin')
        }
    } else {
        res.redirect('/auth#signin')
    }
})

router.post('/signup', async (req, res) => {
    try {
        const {email, name, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const candidate = await User.findOne({email})

        if (candidate) {
            res.redirect('/auth#signup')
        } else {
            const user = new User({
                email,
                name, 
                password: hashedPassword, 
                cart: {items: []}
            })
            await user.save()
            res.redirect('/auth#signin')
        }
    } catch (e) {
        console.log(e)
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth#signin')
    })
})

module.exports = router