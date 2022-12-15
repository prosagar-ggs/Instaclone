const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User') 
const crypto = require('crypto')
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys')
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// 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

const transport = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));



router.post('/signup', (req, res) => {
    // console.log(req.body)
    const {name, email, password,pic} = req.body
    // validations
        if(!name || !email || !password ) {
            return res.status(400).json({error:"name,password and email are required" })
        }
        
        User.findOne({email:email})
            .then(
                (savedUser)=>{
                    if(savedUser) {
                        return res.status(422).json({error:"user is already registered"})
                    }
                    bcrypt.hash(password,12)
                        .then((hashedPassword)=>{
                            const user = new User({
                                name,
                                email,
                                password : hashedPassword,
                                pic
                            
                            })
                            user.save()
                            .then(
                                user => {
                                    transport.sendMail({
                                        to: user.email,
                                        from: 'noreplayinstaclone@gmail.com',
                                        subject: 'Signup success',
                                        html: '<h1>Welcome to Instagram</h1>'
                                    },(err, info) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            console.log(info)
                                        }
                                    });
                                    res.json({ message: "saved successfully" })
                                }
                            )
                            .catch(
                                err=>{
                                    console.log(err)
                                }
                            )
                    }
                    )
                }
            )
            .catch(
                err=>{
                    console.log(err)
                }
            )

})


router.post('/login', (req, res)=>{
    const {email,password} = req.body
    //console.log(req.body)
        if(!email || !password){
            return res.status(400).json({"error" : "Invalid email or password"})
        }
        User.findOne({email:email})
            .then(
                (savedUser)=>{
                    if(!savedUser){
                        return res.status(400).json({"error" : "Email or password was incorrect"})
                    }

                    bcrypt.compare(password,savedUser.password)
                    .then(
                        (doMatch)=>{
                            if(doMatch == true){
                                const token = jwt.sign({ _id:savedUser._id }, JWT_SECRET)
                                const { _id, name, email,followers,following,pic} = savedUser
                                res.json({token,user:{_id,name,email,followers,following,pic}})

                            }
                            else{
                                return res.status(400).json({error: "Invalid password"})
                            }
                        }
                    )
            }
        )
})

router.post("/resetpassword", (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User dont exists with that email" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    transport.sendMail({
                        to: user.email,
                        from: 'noreplayinstaclone@gmail.com',
                        subject: 'Password reset',
                        html: `
                            <p>You requested for password reset</p>
                            <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                        `
                    })
                    res.json({ message: "check your email" })
                    // console.log(result)
                })
            })
        })
    })

router.post("/newpassword", (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try again session expired" })
            }
            bcrypt.hash(newPassword, 12).then(hashedPassword => {
                user.password = hashedPassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((saveduser) => {
                    res.json({ message: "password updated success" })
                })
            })
        }).catch(err => {
            console.log(err)
        })
})

module.exports = router