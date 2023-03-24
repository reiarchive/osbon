
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

//import lib
const sections = require(appDir + '/lib/sections')
const db = require(appDir + '/lib/database')

//import models
const userModel = require(appDir + '/models/users');
const kandidatModel = require(appDir + '/models/kandidat');

class Voting {

    Vote = async () => {
        const isVote = await userModel.getOne({number : this.userNumber});
        
        if(!isVote) {
            await this.client.sendMessage(this.usersChat.key.remoteJid, { text: "Kamu tidak terdaftar, silahkan _/register nis_ terlebih dahulu"});
            return;
        }

        if(isVote.isVote === true) {
            await this.client.sendMessage(this.usersChat.key.remoteJid, { text: "Kamu sudah menggunakan hak suaramu!"});
            return;
        }

        await userModel.updateFields({number : this.userNumber}, { isVote: true }).then(async () => {
            await kandidatModel.increaseVote(this.userMessage).then(async () => {
                await this.client.sendMessage(this.usersChat.key.remoteJid, { text: "Selamat, kamu telah menggunakan hak suaramu!"});
            })
        });


    }

    sendVoting = async () => {

        const daftarKandidat = await kandidatModel.getByFields("id name visi");

        const listMessage = {
            title: "List Kandidat",
            text: process.env.MSG_SUCCESS_REGISTER,
            buttonText: "Klik disini!",
            sections: await sections.ListKandidat(daftarKandidat)
        }

        this.client.sendMessage(this.usersChat.key.remoteJid, listMessage);

    }

    init = async () => {

        
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


module.exports = Voting
