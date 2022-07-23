const {body} = require('express-validator');

const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('avatarUrl', 'Неверая ссылка на аватар').optional().isURL()
];

module.exports = registerValidation