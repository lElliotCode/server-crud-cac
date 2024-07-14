import crypto from 'crypto'

const secret = crypto.randomBytes(32).toString('hex');

module.exports = {
    dbConfig: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'my_database'
    },
    jwtSecret: secret
}