const { getSession, resetSession } = require("../utils/sessionManager")
const config = require("../config/botConfig")

async function processMessage(client,message){

const number = message.from

if(config.BLOCKED_NUMBERS.includes(number)){
return
}

const session = getSession(number)
const text = message.body.trim()

if(session.stage==="MAIN_MENU"){

await client.sendMessage(number,

`Welcome to PurelyJid

Select an option number:

1️⃣ Inquiry for Varmala / Flower Preservation
2️⃣ Resin Artist Raw Materials
3️⃣ Store Location
4️⃣ Resin Art Offline Course`

)

session.stage="MAIN_SELECTION"
return
}

if(session.stage==="MAIN_SELECTION"){

if(text==="1"){

await client.sendMessage(number,

`Select an option number:

1️⃣ Wooden Frame
2️⃣ Luxury Tabletop
3️⃣ Keychains & Bookmarks
4️⃣ Wall Clock

Type BACK to return`

)

session.stage="VARMALA_MENU"
return
}

if(text==="2"){

await client.sendMessage(number,

`Select an option number:

1️⃣ Silicone Moulds
2️⃣ Wooden frames
3️⃣ Resin Pigments
4️⃣ Essential Tools
5⃣ Other Raw Materials

Type BACK to return`
)

session.stage="RAW_MENU"
return
}

if(text==="3"){

await client.sendMessage(number,
`Our Store Location

${config.LINKS.LOCATION}`)

scheduleInterest(client,number)

return
}

if(text==="4"){

await client.sendMessage(number,
`Offline Course Details

${config.LINKS.COURSE}`)

scheduleInterest(client,number)

return
}

}

if(session.stage==="VARMALA_MENU"){

if(text.toLowerCase()==="back"){

session.stage="MAIN_SELECTION"
return processMessage(client,message)

}

await client.sendMessage(number,

`All preservation details are available here:

${config.LINKS.VARMALA}`
)

scheduleInterest(client,number)

}

if(session.stage==="RAW_MENU"){

if(text.toLowerCase()==="back"){

session.stage="MAIN_SELECTION"
return processMessage(client,message)

}

await client.sendMessage(number,

`Complete Raw Material Catalogue:

${config.LINKS.RAW_MATERIAL}`
)

scheduleInterest(client,number)

}

if(session.stage==="INTEREST"){

if(text.toLowerCase()==="yes"){

await client.sendMessage(number,
"Thankyou for showing interest. Our team will get in touch with you shortly.")

const customerNumber = number.replace("@c.us","")

await client.sendMessage(
config.OWNER_NUMBER,
`Customer has shown interest in our services.

Customer Number:
https://wa.me/${customerNumber}`
)

resetSession(number)

return
}

if(text.toLowerCase()==="no"){

await client.sendMessage(number,
"Thankyou for showing interest. Feel free to connect with us in future.")

resetSession(number)

return
}

}

}

function scheduleInterest(client,number){

const session = getSession(number)

session.stage="WAITING"

setTimeout(async ()=>{

await client.sendMessage(number,

`Do you wish to proceed ahead to place your order at our store?

Reply YES or NO`
)

session.stage="INTEREST"

},120000)

}

module.exports = { processMessage }
