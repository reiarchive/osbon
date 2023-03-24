
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

//import lib
const sections = require(appDir + '/lib/sections')
const db = require(appDir + '/lib/database')

//import model
const userModel = require(appDir + '/models/users');
const nisModel = require(appDir + '/models/nis');
const kandidatModel = require(appDir + '/models/kandidat');


class Register {

    Register = async () => {
        
        const isExists = await userModel.getOne({ number: this.userNumber });

        if(isExists) {
            this.client.sendMessage(this.usersChat.key.remoteJid, { text : process.env.MSG_SUCCESS_REGISTER })
            return;
        }

        const splittedRowId = (this.userMessage).split("_");
        
        this.nis = splittedRowId[1];
        this.infoNis = await nisModel.getOne({ nis : this.nis })

        if(!this.infoNis) {
            this.client.sendMessage(this.usersChat.key.remoteJid, { text : "Nis tidak ada dalam database!"})
            return;
        }

        if(this.userNumber !== splittedRowId[2]) {
            this.client.sendMessage(this.usersChat.key.remoteJid, { text : "Error, hubungi admin!"}); 
            return;
        }

    
        try {

            const addUserToDB = await userModel.insertFields({
                    number: this.userNumber,
                    nis: this.nis,
                    real_name: this.infoNis.nama,
                    whatsapp_name: this.whatsapp_name,
            });
            
            if(!addUserToDB) {
                this.client.sendMessage(this.usersChat.key.remoteJid, { text : process.env.MSG_FAILED_ADDUSER })
                return;
            }

            const daftarKandidat = await kandidatModel.getByFields("id name visi");

            const listMessage = {
                title: "Berhasil terdaftar!",
                text: process.env.MSG_SUCCESS_REGISTER,
                buttonText: "Klik disini!",
                sections: await sections.ListKandidat(daftarKandidat)
            }

            this.client.sendMessage(this.usersChat.key.remoteJid, listMessage);
            
            return;

        

        } catch (err) {
            if (err.code === 11000 || err.code === 11001)
                this.client.sendMessage(this.usersChat.key.remoteJid, { text : process.env.MSG_FAILED_DUPLICATE })
            return;
        }
    }

    sendPilihan = async () => {
        
        const listMessage = {
            title: "Data diri",
            text:   "Nama : " + this.infoNis.nama + "\n" +
                    "NIS     : " + this.infoNis.nis + "\n\n" +
                    "Klik tombol untuk konfirmasi identitas kamu!",
            buttonText: "Klik disini!",
            sections : await sections.Konfirmasi(this.nis, this.userNumber)
        };

        this.client.sendMessage(this.usersChat.key.remoteJid, listMessage);
        return;

    }

    init = async () => {

        const isExists = await userModel.getOne({ number: this.userNumber });
        
        if(isExists) {
            this.client.sendMessage(this.usersChat.key.remoteJid, { text : process.env.MSG_SUCCESS_REGISTER })
            return;
        }

        this.nis = parseInt((this.userMessage).split(" ")[1]);

        if(isNaN(this.nis)) {
            this.client.sendMessage(this.usersChat.key.remoteJid, { text : "NIS Harus berupa angka"})
            return;
        }

        this.infoNis = await nisModel.getOne({ nis : this.nis })

        if(!this.infoNis) {
            this.client.sendMessage(this.usersChat.key.remoteJid, { text : "NIS tidak ada"})
            return;
        }

        await this.sendPilihan()
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


module.exports = Register
