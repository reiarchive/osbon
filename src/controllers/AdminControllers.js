
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const request = require('request').defaults({ encoding: null });

//import models
const adminModel = require(appDir + '/models/admin');
const kandidatModel = require(appDir + '/models/kandidat');

//import lib
const db = require(appDir + '/lib/database')

class Admin {

    downloadFileFromUrlAsBuffer = async (fileUrl) => {
        try{
    
            const buffer = await new Promise((resolve) => {
                request.get(fileUrl, function (err, res, body) {
                        if(err) {
                            resolve(false);
                        }
                        resolve(body);
                });
            })
    
            if(buffer) {
                return buffer;
            } else {
                return false;
            }
        } catch (e) {
            return;
        }
    }

    addImage = async () => {

        await this.init();

        if(this.isAdmin) {
            const [_, url, kandidat_id] = (this.userMessage).split(' ');

            const downloadFile = await this.downloadFileFromUrlAsBuffer(url);
            if(downloadFile) {

                this.kandidat.id = kandidat_id
                
                const imageToBase64 = new Buffer.from(downloadFile, 'base64').toString('base64');

                const updatePicture = await kandidatModel.updateFields({ id: this.kandidat.id }, { picture: imageToBase64 });

                if(updatePicture) {
                    this.client.sendMessage(this.usersChat.key.remoteJid, { text : process.env.MSG_SUCCESS_ADMIN_UPDATEPICTURE })
                
                } else {
                    this.client.sendMessage(this.usersChat.key.remoteJid, { text : process.env.MSG_FAILED_ADMIN_UPDATEPICTURE })
                
                }

                return;
            } else {
                this.client.sendMessage(this.usersChat.key.remoteJid, { text : process.env.MSG_FAILED_ADMIN_DOWNLOAD_UPDATEPICTURE })
            }

        } else {
            console.log("bukan admin cuy")
        }
    }

    init = async () => {
        this.isAdmin = await adminModel.checkAdmin(this.userNumber)        
    }
    
    constructor (client, usersChat, userMessage) {

        this.client = client;
        this.usersChat = usersChat;
        this.userMessage = userMessage;
        this.whatsapp_name = usersChat.pushName;
        this.userNumber = ((this.usersChat.key.remoteJid).toString()).split('@')[0];
        
        //kandidat
        this.kandidat = {};

        this.isAdmin = false;


    }

}


module.exports = Admin
