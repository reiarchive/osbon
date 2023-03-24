
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

//import lib
const sections = require(appDir + '/lib/sections')
const db = require(appDir + '/lib/database')

//import models
const kandidatModel = require(appDir + '/models/kandidat');

class Kandidat {

    Detail = async () => {

        const daftarKandidat = await kandidatModel.getOne({ id : this.userMessage });

        const caption = `VISI : \n${daftarKandidat.visi}\n\nMISI : \n${daftarKandidat.misi}`

        await this.client.sendMessage(this.usersChat.key.remoteJid, {
            image: Buffer.from(daftarKandidat.picture, "base64"),
            caption: caption
        }).then(async () => {

            const listMessage = {
                title: "Detail kandidat",
                text: process.env.MSG_SUCCESS_KANDIDAT_DETAIL,
                buttonText: "Vote disini!",
                sections: await sections.ConfirmVote(this.userMessage)
            }
    
            await this.client.sendMessage(this.usersChat.key.remoteJid, listMessage);
        });

        return;
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


module.exports = Kandidat
