activeMatches = {}

addMatch = (obj, socketId) => {
    if (activeMatches.hasOwnProperty(obj.matchId)) {
        activeMatches[obj.matchId][obj.player] = socketId;
        return activeMatches[obj.matchId]
    } else {
        let color = obj.player
        let newObj = {}
        newObj[color] = socketId
        newObj["last_move"] = {}
        activeMatches[obj.matchId] = newObj
        return activeMatches[obj.matchId]
    }
}

logMatchMove = (data) => {
    matchId = data.matchId
    activeMatches[matchId]['last_move'] = data
}

getLastMove = (matchId) => {
    return activeMatches[matchId]['last_move']
}

removeMatch = (obj) => {
    delete activeMatches[obj.matchId];
}

removePlayerFromMatch = (message) => {
    matchId = message.matchId
    player_off = message.player
    delete activeMatches[matchId][player_off]
    return activeMatches[matchId]
}

getRecipientAddress = (message) => {
    matchId = message.matchId
    recipient = message.recipient
    match = activeMatches[matchId]
    re_addr = match[recipient]
    return re_addr
}



module.exports = {
    addMatch,
    getRecipientAddress,
    removeMatch,
    removePlayerFromMatch,
    logMatchMove,
    getLastMove
}


// activeMatches = {
//     "#matchId": {
//         b: socketId,
//         w: socketId,
//     }
// }

// 'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -',
// 'source': '',
// 'target': '',
// 'sender': '',
// 'recipient': '',
// 'matchId': '',
// 'game_stats': { over: '', winner: '' },
// 'time': ''
