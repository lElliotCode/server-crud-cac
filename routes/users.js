import { Router } from "express";
import { dataBase } from "../database.js";
import { validateUser, validatePartialUser } from "../schemas/users.js";
import { format, parseISO, parse } from 'date-fns';

export const usersRoutes = Router()

// Ruta protegida
/* usersRoutes.get('/protected', authenticateToken, (req, res) => {
    res.send('Esta es una ruta protegida');
});
*/

//Obtener todos los usarios
usersRoutes.get('/', (req, res) => {
    const query = 'SELECT * FROM users'
    dataBase.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err)
            return
        }
        res.json(results)
    })
})

usersRoutes.post('/register', (req, res) => {

    const result = validateUser(req.body)

    if(result.error){
        const formattedErrors = result.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
        }));
        return res.status(400).json({ 
            message : formattedErrors 
        })
    }

    const {user_fullname, email, password, phone, birthday, question , answer , isAdmin = false} = req.body

    // Formateamos la fecha de nacimiento para guardarla en la base de datos
    console.log(birthday)
    const formatedBirthday = (date) => {
        try{
            return format(parse(date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')
        } catch (e){
            console.log(date, e)
        }
    }
    const formattedDate = formatedBirthday(birthday.split('/').reverse().join('-'))
    // Hasheamos la password para guardarla en la base de datos
    

    const query = 'INSERT INTO users (user_fullname, email, password, phone, birthday, question, answer, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    dataBase.query(query, [user_fullname, email, password, phone, formattedDate, question, answer, isAdmin], (err, result) => {
        if(err) {
            res.status(500).send({message: `Acá el error: ${err}`});
            return;
        }
        res.send({message: `'Usuario registrado con ID: ${result.insertId}`})
    })
    // res.send({message: "Usuario obtenido en el backend", data: result})
})

usersRoutes.post('/login', (req, res) => {
    const query = 'SELECT * FROM users'
    const {email, password} = req.body
    dataBase.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err)
            return
        }
        results.forEach(user => {
            if(user.email === email && user.password === password){

            }
        })
        res.json(results)
    })
})


// Obtener usuario por ID
usersRoutes.get('/:id', (req, res) => {
    const { id } = req.params
    const query = 'SELECT * FROM users WHERE id_user = ?'
    dataBase.query(query, [id], (err, results) => {
        if(err) {
            res.status(500).send(err)
            return
        }
        res.json(results)
    })
})

// Crear un nuevo usuario
usersRoutes.post('/', (req, res) => {
    const result = validateUser(req.body)

    if(result.error){
        const formattedErrors = result.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
        }));
        return res.status(400).json({ 
            message : formattedErrors 
        })
    }

    const {user_fullname, email, password, phone, birthday, question = null, answer = null, isAdmin = false} = req.body
    const formatedBirthday = format(parseISO(birthday), 'yyyy-MM-dd')
    const query = 'INSERT INTO users (user_fullname, email, password, phone, birthday, question, answer, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    dataBase.query(query, [user_fullname, email, password, phone, formatedBirthday, question, answer, isAdmin], (err, result) => {
        if(err) {
            res.status(500).send(err);
            return;
        }
        res.send('Item creado con ID: ' + result.insertId)
    })
})

// Registrar usuario en produccion




//Modificar usuario existente o crearlo si no existe
usersRoutes.put('/:id', (req, res) => {
    const { id } = req.params
    const result = validatePartialUser(req.body)

    if(result.error){
        const formattedErrors = result.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
        }));
        return res.status(400).json({ 
            message : formattedErrors 
        })
    }

    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(req.body)) {
        if (value !== undefined) { // Solo se actualizan los campos definidos
        updates.push(`${key} = ?`);
        values.push(value);
        }
    }

    if (updates.length === 0) {
        return res.status(400).json({ message: 'error' });
    }

    values.push(id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id_user = ?`

    dataBase.query(query, values, (err, result) => {
        if(err){
            return res.status(500).send(err)
        }
        res.send(`Usuario con ID: ${id} actualizado correctamente`)
    })
})

// Eliminar usuario por ID
usersRoutes.delete('/:id', (req, res) => {
    const { id } = req.params
    const queryFormatAI = 'ALTER TABLE users AUTO_INCREMENT = 1'
    const queryDelete = 'DELETE FROM users WHERE id_user = ?'
    
    dataBase.query(queryDelete, [id], (err, result) => {
        if (err) {
            res.send(`Error to delete user ID : ${id}, ${err}`)
        }
        return res.send(`Item con ID: ${id} eliminado correctamente`)
    }) 

    dataBase.query(queryFormatAI, [id], (err, result) => {
        if(err) {
            return res.status(500).send(err)
        }

    })
})