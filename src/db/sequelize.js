const {Sequelize, DataTypes} = require('sequelize')
let pokemons = require('./mock-pokemons')
const PokemonModel = require('../models/pokemon')

const sequelize = new Sequelize('pokedex', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
        timezone: 'Etc/GMT-2'
    },
    logging: true
})

const Pokemon = PokemonModel(sequelize, DataTypes)

const initDb = () => {
    return sequelize.sync({force: true}).then(_ => {
        pokemons.map(pokemon => {
            Pokemon.create({
                name: pokemon.name,
                hp: pokemon.hp,
                cp: pokemon.cp,
                picture: pokemon.picture,
                types: pokemon.types.join()
            }).then(pokemon => console.log(pokemon.toJSON()))
        })
        console.log('La bdd est initialisée')
    })
}

module.exports = {
    initDb, Pokemon
}