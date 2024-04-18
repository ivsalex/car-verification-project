const jwt = require('jsonwebtoken');
const { rolePermissions } = require('./permissions');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;

        const role = req.user.role;
        const permissions = rolePermissions[role];
        req.user.permissions = permissions;

        next();
    } catch {
        return res.status(501).json({
            message: 'Auth failed!'
        });
    }
};