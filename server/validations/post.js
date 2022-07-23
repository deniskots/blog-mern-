const {body} = require('express-validator');

const postValidation = [
    body('title', 'Введите заголовок').isLength({min: 3}).isString(),
    body('text', 'Введите текст').isLength({min: 3}).isString(),
    body('tags', 'Неверный формат').optional().isString(),
    body('imageUrl', 'Неверая ссылка на аватар').optional().isString()
];

module.exports = postValidation