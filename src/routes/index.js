const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const c = require(appDir + '/controllers/')

const textMessage = async (client, usersChat, usersMessage) => {
    
    if((usersMessage).startsWith('/register ')) {
        await (new c.Register(client, usersChat, usersMessage)).init()
    }

    if((usersMessage).startsWith('/voting'))
        await (new c.Voting(client, usersChat, usersMessage)).sendVoting()

    if((usersMessage).startsWith('/addimage '))
        await (new c.Admin(client, usersChat, usersMessage)).addImage()

}

const listResponseMessage = async (client, usersChat, selectedRowId) => {
    
    if(selectedRowId.startsWith('confirm_'))
        await (new c.Register(client, usersChat, selectedRowId)).Register();

    if(selectedRowId.startsWith('reject_'))
        await client.sendMessage(usersChat.key.remoteJid, { text : "Silahkan register ulang" })

    if(selectedRowId.startsWith('detail_'))
        await (new c.Kandidat(client, usersChat, (selectedRowId).replace("detail_", ""))).Detail();

    if(selectedRowId.startsWith('vote_'))
        await (new c.Voting(client, usersChat, (selectedRowId).replace("vote_", ""))).Vote();

}

module.exports = { textMessage, listResponseMessage }