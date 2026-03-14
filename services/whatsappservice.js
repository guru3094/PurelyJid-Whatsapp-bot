const { Client, LocalAuth } = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")
const { processMessage } = require("./botService")

function startWhatsapp(){

const client = new Client({

authStrategy: new LocalAuth(),

puppeteer:{
args:['--no-sandbox','--disable-setuid-sandbox']
}

})

client.on("qr",(qr)=>{

// Generate scannable QR
qrcode.generate(qr,{small:true})

})

client.on("ready",()=>{
console.log("✅ WhatsApp Bot Ready")
})

client.on("message",async message=>{

// Ignore Status
if(message.from==="status@broadcast"){
return
}

// Ignore Groups
if(message.from.includes("@g.us")){
return
}

await processMessage(client,message)

})

client.initialize()

}

module.exports = startWhatsapp

