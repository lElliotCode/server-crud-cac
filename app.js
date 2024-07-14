import express from 'express'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'
import { usersRoutes } from './routes/users.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()
const PORT = 3000

app.use(express.json()) // ---> MIDDLEWARE
//Permitir origen CORS
app.use(corsMiddleware())

const _filename = fileURLToPath(import.meta.url)
const _dirname = dirname(_filename)

app.use(express.static(path.join(_dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.use('/users', usersRoutes)


app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})