const { default: whatsappConnect, useSingleFileAuthState, downloadMediaMessage, DisconnectReason, fetchLatestBaileysVersion, MessageType, Mimetype, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto, getContentType } = require("@adiwajshing/baileys")
const { state, saveState } = useSingleFileAuthState('pemiltos2023')
const figlet = require('figlet')
const chalk = require('chalk')
const pino = require('pino')
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const { Boom } = require('@hapi/boom')

require('dotenv').config({ 
    path: './.env', 
    debug: true 
})

const handleUser = require('./lib/handleUser').main

async function startServer() {
 
    console.log(chalk.green(
        figlet.textSync('Pemiltos', {
		    font: 'Standard',
		    horizontalLayout: 'default',
		    vertivalLayout: 'default',
		    whitespaceBreak: false
	    })
    ));

    const client = whatsappConnect({
        browser: ['Pemiltos 2023','Safari','3.0'],
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
    })

    store.bind(client.ev)

    client.ev.on('messages.upsert', async chatUpdate => {
        try {
            
            const usersChat = chatUpdate.messages[0]            
            
            if (!usersChat.message) return
            usersChat.message = (Object.keys(usersChat.message)[0] === 'ephemeralMessage') ? usersChat.message.ephemeralMessage.message : usersChat.message
            if (usersChat.key && usersChat.key.remoteJid === 'status@broadcast') return
            if (!client.public && !usersChat.key.fromMe && chatUpdate.type === 'notify') return
            if (usersChat.key.id.startsWith('BAE5') && usersChat.key.id.length === 16) return
            
            const typeMessage = getContentType(usersChat.message);

            
            await handleUser(client, usersChat, typeMessage)

        } catch (err) {
            console.log(err)
        }
        
    })
	
    // Handle error
    const unhandledRejections = new Map()
    process.on('unhandledRejection', (reason, promise) => {
        unhandledRejections.set(promise, reason)
        console.log('Unhandled Rejection at:', promise, 'reason:', reason)
    })
    process.on('rejectionHandled', (promise) => {
        unhandledRejections.delete(promise)
    })
    process.on('Something went wrong', function(err) {
        console.log('Caught exception: ', err)
    })
    
    // Setting


    client.public = true

    client.serializeM = (m) => smsg(client, m, store)

    client.ev.on('connection.update', async (update) => {
        console.log("update")
        const { connection, lastDisconnect } = update	    
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect['error']).output.statusCode
            if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); process.exit(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); startServer(); } 
            else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); startServer(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); process.exit(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Delete Session file yusril.json and Scan Again.`); process.exit(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); startServer(); }
            else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); startServer(); }
            else { console.log(`Unknown DisconnectReason: ${reason}|${connection}`); startServer(); }
        } else if(connection === 'open') {
            console.log('Bot conneted to server')
        } else {
            console.log(update)
        }
        // console.log('Connected...', update)
    })

    client.ev.on('creds.update', saveState)

    return client
}


startServer();