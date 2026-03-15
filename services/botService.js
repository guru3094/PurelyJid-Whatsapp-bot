const { getSession, resetSession } = require("../utils/sessionManager")
const config = require("../config/botConfig")

async function processMessage(client, message) {

const number = message.from

// Ignore competitor numbers
if (config.BLOCKED_NUMBERS.includes(number)) {
return
}

const session = getSession(number)
const text = message.body.trim()

/* ---------------- MAIN MENU ---------------- */

if (session.stage === "MAIN_MENU") {

await client.sendMessage(number,

`Welcome to PurelyJid

Please choose an option number:

1️⃣ Inquiry for Varmala / Flower Preservation
2️⃣ Resin Artist Raw Materials
3️⃣ Store Location
4️⃣ Resin Art Offline Course`
)

session.stage = "MAIN_SELECTION"
return
}

/* ---------------- MAIN MENU SELECTION ---------------- */

if (session.stage === "MAIN_SELECTION") {

if (text === "1") {

await client.sendMessage(number,

`Select an option number:

1️⃣ Wooden Frame
2️⃣ Luxury Tabletop
3️⃣ Keychains & Bookmarks
4️⃣ Wall Clock

0️⃣ Back`
)

session.stage = "VARMALA_MENU"
return
}

if (text === "2") {

await client.sendMessage(number,

`Select an option number:

1️⃣ Silicone Moulds
2️⃣ Wooden Frames
3️⃣ Resin Pigments
4️⃣ Essential Tools
5️⃣ Other Raw Materials

0️⃣ Back`
)

session.stage = "RAW_MENU"
return
}

if (text === "3") {

await client.sendMessage(number,
`📍 Our Store Location

${config.LINKS.LOCATION}

0️⃣ Back`
)

session.stage = "LOCATION_MENU"
return
}

if (text === "4") {

await client.sendMessage(number,
`📚 Offline Course Details

${config.LINKS.COURSE}

0️⃣ Back`
)

session.stage = "COURSE_MENU"
return
}

}

/* ---------------- VARMALA MENU ---------------- */

if (session.stage === "VARMALA_MENU") {

if (text === "0") {

session.stage = "MAIN_MENU"
return processMessage(client, message)
}

await client.sendMessage(number,

`All preservation details are available here:

${config.LINKS.VARMALA}`
)

scheduleInterest(client, number)
return
}

/* ---------------- RAW MATERIAL MENU ---------------- */

if (session.stage === "RAW_MENU") {

if (text === "0") {

session.stage = "MAIN_MENU"
return processMessage(client, message)
}

await client.sendMessage(number,

`Complete Raw Material Catalogue:

${config.LINKS.RAW_MATERIAL}`
)

scheduleInterest(client, number)
return
}

/* ---------------- LOCATION MENU ---------------- */

if (session.stage === "LOCATION_MENU") {

if (text === "0") {

session.stage = "MAIN_MENU"
return processMessage(client, message)
}

scheduleInterest(client, number)
return
}

/* ---------------- COURSE MENU ---------------- */

if (session.stage === "COURSE_MENU") {

if (text === "0") {

session.stage = "MAIN_MENU"
return processMessage(client, message)
}

scheduleInterest(client, number)
return
}


/* ---------------- INTEREST STAGE ---------------- */

if (session.stage === "INTEREST") {

if (text.toLowerCase() === "yes") {

const customerNumber = number.replace("@c.us", "")

await client.sendMessage(number,
"Thank you for showing interest. Our team will contact you shortly.")

await client.sendMessage(
config.OWNER_NUMBER,
`New Customer Order Request

Customer Number:
https://wa.me/${customerNumber}`
)

resetSession(number)
return
}

if (text.toLowerCase() === "no") {

await client.sendMessage(number,
"Thank you for contacting PurelyJid. Feel free to message us anytime.")

resetSession(number)
return
}

}

}

/* ---------------- 2 MINUTE FOLLOW UP ---------------- */

function scheduleInterest(client, number) {

const session = getSession(number)

session.stage = "WAITING"

setTimeout(async () => {

await client.sendMessage(number,

`Do you wish to proceed ahead to place your order at our store?

Reply YES or NO`
)

session.stage = "INTEREST"

}, 120000)

}

module.exports = { processMessage }

