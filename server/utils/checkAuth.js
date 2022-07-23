const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            //расшифровка токена и достаем айди
            const decoded = jwt.verify(token, 'secretKey');
            req.userId = decoded._id;
            //если токен расшифрован и добавлен в юзер айди тогда выполняй след функцию
            next();
        } catch (e) {
            return res.status(403).json({message: 'Нет доступа'});
        }
    } else {
        return res.status(403).json({message: 'Нет доступа'});
    }
};