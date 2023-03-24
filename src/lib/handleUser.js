const { dirname } = require('path');
const appDir = dirname(require.main.filename);


const r = require(appDir + '/routes/')

const main = async (client, usersChat, typeMessage) => {
    console.log(typeMessage)

    if(typeMessage == 'conversation' || typeMessage == 'extendedTextMessage') {
        const userMessage = (typeMessage ==  'extendedTextMessage') ? usersChat.message[typeMessage].text : usersChat.message[typeMessage];
        await r.textMessage(client, usersChat, userMessage);
        return;
    }

    if(typeMessage == 'listResponseMessage') {
        const rowId = usersChat.message.listResponseMessage.singleSelectReply.selectedRowId;
        await r.listResponseMessage(client, usersChat, rowId);
        return;
    }

}


module.exports = { main }

