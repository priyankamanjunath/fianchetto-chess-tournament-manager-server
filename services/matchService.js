const fetch = require("node-fetch");
const urlJavaServer = "https://fianchetto-java.herokuapp.com/api"

updateMatch = async (matchId, match) =>
{
    const response = await fetch(`${urlJavaServer}/match/${matchId}/`, {
        method: "PUT",
        body: JSON.stringify(match),
        headers: {
            'content-type': 'application/json'
        }
    })
    
    return await response.json()
}

module.exports = {
    updateMatch
}
