const guard = require('express-jwt-permissions')({
    requestProperty: 'user',
    permissionsProperty: 'permissions'
});

const rolePermissions = {
    Admin: ['get-all-cars', 'get-one-car', 'create-car', 'modify-car', 'delete-car',
        'get-all-users', 'get-one-user', 'create-user', 'modify-user', 'delete-user']
};

module.exports = {
    guard,
    rolePermissions
};