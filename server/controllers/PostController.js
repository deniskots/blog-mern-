const PostModel = require("../models/Post");

class PostController {
    async create(req, res) {
        try {
            const doc = new PostModel({
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags.split(','),
                imageUrl: req.body.imageUrl,
                user: req.userId,
            });

            const post = await doc.save();
            res.json(post)
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось создать статью'})
        }
    };

    async getAll(req, res) {
        try {
            //через популейт мы отображаем полную информацию обьекта(связываем с другой моделью)
            const posts = await PostModel.find().populate('user').exec()
            res.json(posts)
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось получить все статьи'})
        }
    };

    async getOne(req, res) {
        try {
            const postId = req.params.id
            //можно и просто файндван,но необходимо возращать обновленную статью,для изменения счетчика просмотра
            PostModel.findOneAndUpdate({
                    _id: postId
                }, {
                    $inc: {viewCount: 1}
                }, {
                    returnDocument: 'after'
                },
                (err, doc) => {
                    if (err) {
                        return res.status(500).json({message: 'Не удалось получить статью'})
                    }
                    if (!doc) {
                        return res.status(404).json({message: 'Статья не обнаружена'})
                    }
                    res.json(doc)
                }).populate('user')

        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось получить статью'})
        }
    };

    async delete(req, res) {
        try {
            const postId = req.params.id
            PostModel.findByIdAndDelete({
                _id: postId
            }, (err, doc) => {
                if (err) {
                    return res.status(500).json({message: 'Не удалось удалить статью'})
                }
                if (!doc) {
                    return res.status(404).json({message: 'Статья не обнаружена'})
                }
                res.json({
                    success: true
                })
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось удалить статью'})
        }
    };

    async update(req, res) {
        try {
            const postId = req.params.id;
            await PostModel.updateOne(
                {
                    _id: postId
                },
                {
                    title: req.body.title,
                    text: req.body.text,
                    tags: req.body.tags.split(','),
                    imageUrl: req.body.imageUrl,
                    user: req.userId,
                },)
            res.json({
                success: true
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось обновить статью'})
        }
    }

    async getTags (req, res) {
        try {
            const posts = await PostModel.find().limit(5).exec()
            const tags = posts.map(obj => obj.tags).flat().slice(0, 3)
            res.json(tags)
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось получить все тэги'})
        }
    }
}


module.exports = new PostController();