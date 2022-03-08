const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function(course) {
    const items = this.cart.items
    const i = items.findIndex(c => 
        c.courseId.toString() === course._id.toString()
    )
    if (i < 0) {
        items.push({
            count: 1,
            courseId: course._id
        })
    } else {
        items[i].count += 1
    }

    this.cart = {items}

    return this.save()
}

userSchema.methods.deleteFromCart = function(id) {
    let items = [...this.cart.items]
    const i = items
    .findIndex(c => c.courseId.toString() === id.toString())

    if (items[i].count > 1) {
        items[i].count--
    } else {
        items = items.filter(c => c.courseId.toString() !== id.toString())
    }

    this.cart = {items}
    return this.save()
}

userSchema.methods.clearCart = function() {
    let items = []
    this.cart = {items}
    return this.save()
}

module.exports = model('User', userSchema)