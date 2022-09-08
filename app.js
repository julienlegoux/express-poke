const express = require('express')
const {success} = require('./helper')
let pokemons = require('./mock-pokemons')

const app = express()
const port = 3000

app.get('/', (req,res) => res.send('hello, Express 2 !'))

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    const message = 'Un pokémon a bien été trouvé.'
    res.json(success(message, pokemon))
})

app.get('/api/pokemons', (req, res) => {
    const message = 'Voici la liste complète des pokémons dans le pokédex !'
    res.json(success(message, pokemons))
})

app.listen(port, () => console.log(`Notre app est ouverte sur http://localhost:${port}`))