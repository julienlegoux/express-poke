exports.success = (message, data) => {
    return {message, data}
}

exports.getUniqueId = (pokemons) => {
    const pokemonsIds = pokemons.map(pokemon => pokemon.id)
    const uniqueId = pokemonsIds.reduce((a, b) => Math.max(a, b))
    return uniqueId + 1
}