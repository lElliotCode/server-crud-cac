import mysql from 'mysql2'

const dataBase = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'my_database'
});

// Creamos una función para crear la base de datos si no existe al igual que las tablas
const initilizeDatabase = () => {
    const createDatabase = 'CREATE DATABASE IF NOT EXISTS my_database'
    dataBase.query(createDatabase, (err, result) => {
        if (err) {
            console.log(`Error creating database ${err}`)
            return
        }
        console.log('Database created or already exists')
    })

    // Acá usamos la base de datos para poder realizar operaciones
    dataBase.changeUser({database: 'my_database'}, (err) => {
        if (err) {
            console.log(`Error changing to database: ${err}`)
        }
        
        // Una vez usando la db, creamos la tabla usuarios si no existe
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id_user INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                user_fullname VARCHAR(50) NOT NULL,
                email VARCHAR(50) NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(40) NOT NULL,
                birthday DATE,
                question VARCHAR(150) DEFAULT NULL,
                answer VARCHAR(150) DEFAULT NULL,
                isLogueado BOOLEAN DEFAULT FALSE,
                isAdmin BOOLEAN DEFAULT FALSE
            )
        `

        dataBase.query(createUsersTable, (err, result) => {
            if (err) {
                console.log(`Error creating table ${err}`)
                return
            }
            console.log('users table created or already exists')
        })
    })
}

dataBase.connect((err) => {
    if (err) {
        console.log(`Error al conectar a la base de datos: ${err}`)
        return
    }
    console.log('Conectado a la base de datos correctamente')
    initilizeDatabase();
})

export { dataBase } ;