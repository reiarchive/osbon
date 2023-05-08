
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

//import lib
const sections = require(appDir + '/lib/sections')
const db = require(appDir + '/lib/database')

//import model
const userModel = require(appDir + '/models/users');
const nisModel = require(appDir + '/models/nis');
const kandidatModel = require(appDir + '/models/kandidat');


class Guest {

    Guest = async () => {
        
        const isExists = await userModel.getOne({ number: this.userNumber });

        if(isExists) {
            this.client.sendMessage(this.usersChat.key.remoteJid, { text : process.env.MSG_ALREADY_GUEST })
            return;
        }else{
            this.client.sendMessage(this.usersChat.key.remoteJid, { text : process.env.MSG_YET_GUEST })
            return
        }
    }

    constructor (client, usersChat, userMessage) {

        this.client = client
        this.usersChat = usersChat
        this.userMessage = userMessage
        this.whatsapp_name = usersChat.pushName
        this.userNumber = ((this.usersChat.key.remoteJid).toString()).split("@")[0]

        this.nis;

    }

}


module.exports = Guest
