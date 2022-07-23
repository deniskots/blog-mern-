const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");

class UserController {
     async register(req, res) {
        try {
            const password = req.body.password;
            const salt = await bcrypt.genSalt(8);
            const hash = await bcrypt.hash(password, salt)

            const doc = new UserModel({
                email: req.body.email,
                fullName: req.body.fullName,
                avatarUrl: req.body.avatarUrl,
                passwordHash: hash,
            })
            const user = await doc.save()

            const token = jwt.sign({
                _id: user._id
            },'secretKey', {expiresIn: '30d'})

            //что бы не доставть пасвордхэш при регистрации
            const {passwordHash, ...userData} = user._doc

            res.json({
                ...userData,
                token
            })
        }catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось произвести регистрацию'
            })
        }
    };

    async login(req, res)  {
        try {
            const user = await UserModel.findOne({email: req.body.email})
            if(!user) {
                return res.status(404).json({message: 'Sorry, этот пользователь отсутсвует'})
            }

            const isPassValid = bcrypt.compare(req.body.password, user._doc.passwordHash)
            if(!isPassValid) {
                return res.status(400).json({message: 'Sorry, неверный логин или пароль'})
            }

            const token = jwt.sign({
                _id: user._id
            },'secretKey', {expiresIn: '30d'})

            //что бы не доставть пасвордхэш при регистрации
            const {passwordHash, ...userData} = user._doc

            res.json({
                ...userData,
                token
            })
        }catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось произвести авторизацию'
            })
        }
    };

     async checkMe(req, res) {
        try {
            const user = await UserModel.findById(req.userId);
            if(!user) {
                return res.status(404).json({message: 'Пользователь не найден'})
            };
            const {passwordHash, ...userData} = user._doc;

            res.json({
                ...userData
            })
        }catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось '
            })
        }
    };
}


module.exports = new UserController()
