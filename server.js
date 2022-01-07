const express = require('express')
const app = express()
const port = process.env.PORT
const path = require('path')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

// midle
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// authen
function checkLogin(req, res, next) {
    try {
        const token = req.cookies.token
        const decoded = jwt.verify(token, 'secret');
        next()
    } catch(err) {
        res.redirect('/login')
    }
}

// route
app.get('/', checkLogin, (req, res, next) => {
    res.sendFile(path.join(__dirname, '/html/home.html'))
})

app.get('/login', (req, res, next) => {
    res.clearCookie('user')
    .clearCookie('token')
    .sendFile(path.join(__dirname, '/html/login.html'))
})

app.post('/login', (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    let logined = false
    db.forEach(user => {
        if(user.username == username && user.password == password) {
            const token = jwt.sign({ user: `${user.role}` }, 'secret', { expiresIn: 5 * 60 });

            res.cookie('token', token)
            .cookie('user', user.role)
            logined = true
        }
    })
    res.redirect('/')
})

app.get('/cookie', (req, res, next) => {
    res.send(req.cookies)
})

app.use('/', (req, res, next) => {
    res.redirect('/')
})

// database
const db = [
    {
        'username': 'admin',
        'password': 'admin',
        'role': 'admin',
    },
    {
        'username': 'manager',
        'password': 'manager',
        'role': 'manager',
    },
    {
        'username': 'customer',
        'password': 'customer',
        'role': 'customer',
    },
]

// other
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
