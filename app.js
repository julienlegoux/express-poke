const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const {Sequelize, DataTypes} = require('sequelize')
const {success, getUniqueId} = require('./helper')
let pokemons = require('./mock-pokemons')
const PokemonModel = require('./src/models/pokemon')

const app = express()
const port = 3000

const sequelize = new Sequelize(
    'pokedex', // name bdd
    'root', // username bdd
    '', // password bdd
    {
        host: 'localhost', // mandatory
        dialect: 'mariadb', // mandatory
        dialectOptions: {
            timezone: 'Etc/GMT-2'
        },
        logging: false
    }
)

sequelize.authenticate()
    .then(_ => console.log('La connexion est établie avec la bdd'))
    .catch(error => console.error(`Impossible de se connecter à la bdd ${error}`))

const Pokemon = PokemonModel(sequelize,DataTypes)

sequelize.sync({force:true})
    .then(_ => console.log('La bdd Pokedex a bien été sync!'))

app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())

app.get('/', (req,res) => res.send('hello, Express !'))


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

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons)
    const pokemonCreated = {...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokemon ${pokemonCreated.name} a bien été créé.`
    res.json(success(message, pokemonCreated))
})

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonUpdated = { ...req.body, id: id}
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })
    const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.`
    res.json(success(message, pokemonUpdated))
})

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
    pokemons = pokemons.filter(pokemon => pokemon.id !== id)
    const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`
    res.json(success(message, pokemonDeleted))
})

app.listen(port, () => console.log(`Notre app est ouverte sur http://localhost:${port}`))