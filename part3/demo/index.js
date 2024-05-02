// import Node built-in webserver using CommonJS syntax
const express = require('express')
const app = express()
app.use(express.json());    // json-parser for POST request


// sampleJSON data to render
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    },
    {
        id: 4,
        content: "HTTP Methods are useless. (This note should be deleted)",
        important: false
    }
]


// register different routes and HTTP methods
// GET
app.get('/', (request, response) => {
    response.send('<h1>Heello World!</h1>');
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find((note => note.id === id))
    if(!note){
        response.status(404).send('<pre>Requested note does not exist. Check the note ID again.</pre>')
    }
    else{ response.json(note) }
})

// POST
app.post('/api/notes', (request, response) => {
    const generateId = () => {
        const maxId = notes.reduce((max, note) => Math.max(max, +note.id), 0)
        return maxId + 1
    }

    const body = request.body
    if(!body.content){
        return response.status(400).json({
            error: 'Missing content'
        })
    }
    
    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId()
    }
    notes.concat(note)
    response.json(note)
})


// DELETE
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end();
})

// declare port number
const PORT = 3001
app.listen(PORT);
console.log(`Server running on port ${PORT}`);