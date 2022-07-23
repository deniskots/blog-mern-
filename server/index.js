const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const registerValidation = require("./validations/auth");
const checkAuth = require("./utils/checkAuth");
const handleErrors = require("./utils/handleErrors");
const UserController = require('./controllers/UserController');
const PostController = require('./controllers/PostController');
const postValidation = require("./validations/post");
const multer = require("multer");

mongoose.connect('mongodb+srv://admin:admin@cluster0.x4xze.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Db ok'))
    .catch((err) => console.log(err))

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({storage});

app.use(express.json());
//для отображения файлов в папке загрузок
app.use('/uploads', express.static('uploads'))
app.use(cors())


app.post('/auth/register', registerValidation, handleErrors, UserController.register);
app.post('/auth/login', UserController.login);
app.get('/auth/me', checkAuth, UserController.checkMe)

app.post('/posts',checkAuth, postValidation, handleErrors, PostController.create);
app.get('/posts/:id', PostController.getOne);
app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getTags);
app.delete('/posts/:id',checkAuth, PostController.delete);
app.patch('/posts/:id', postValidation, handleErrors, PostController.update);
app.get('/posts/tags', PostController.getTags);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.listen(3434, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server is running')
})