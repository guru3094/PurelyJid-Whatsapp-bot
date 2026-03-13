const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const { loadCatalogue, getMenu } = require("./catalogueService");

let client;

const userState = {};
const botDisabled = {};

function initWhatsApp() {

  client = new Client({
    authStrategy: new LocalAuth()
  });

  client.on("qr", qr => {
    console.log("Scan QR with WhatsApp:");
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("WhatsApp bot ready");
  });

  client.on("message", async msg => {

    const text = msg.body.trim().toLowerCase();
    const user = msg.from;

    if (botDisabled[user]) return;

    const menu = getMenu();
    const catalogue = loadCatalogue();

    /* Greeting */

    if (text === "hi" || text === "hello") {

      userState[user] = "ASK_ARTIST";
      await msg.reply(menu.ask_artist);

      return;
    }

    /* Step 1 : Are you a resin artist */

    if (userState[user] === "ASK_ARTIST") {

      if (text === "1" || text === "yes") {

        const owner = process.env.OWNER_NUMBER + "@c.us";

        await msg.reply("Our team will contact you shortly.");

        await client.sendMessage(
          owner,
          `Resin Artist reached out.\nCustomer: ${user}`
        );

        botDisabled[user] = true;   // stops bot ONLY for that user
        return;
      }

      if (text === "2" || text === "no") {

        userState[user] = "SERVICE_MENU";

        await msg.reply(menu.service_menu + "\n\n0️⃣ Back");

        return;
      }

    }

    /* Step 2 : Service menu */

    if (userState[user] === "SERVICE_MENU") {

      if (text === "0") {

        userState[user] = "ASK_ARTIST";
        await msg.reply(menu.ask_artist);

        return;
      }

      if (text === "1") {

        let message = "Varmala Preservation Catalogue\n\n";

        catalogue.varmala_catalogue.forEach((item, index) => {
          message += `${index + 1}. ${item.name} - ₹${item.price}\n`;
        });

        message += "\n\n0️⃣ Back";

        await msg.reply(message);

        userState[user] = "ORDER_PROMPT";

        await msg.reply(menu.place_order + "\n\n0️⃣ Back");

        return;
      }

      if (text === "2") {

        let message = "Workshop Catalogue\n\n";

        catalogue.workshop_catalogue.forEach((item, index) => {
          message += `${index + 1}. ${item.name} - ₹${item.price}\n`;
        });

        message += "\n\n0️⃣ Back";

        await msg.reply(message);

        userState[user] = "ORDER_PROMPT";

        await msg.reply(menu.place_order + "\n\n0️⃣ Back");

        return;
      }

    }

    /* Step 3 : Order prompt */

    if (userState[user] === "ORDER_PROMPT") {

      if (text === "0") {

        userState[user] = "SERVICE_MENU";
        await msg.reply(menu.service_menu + "\n\n0️⃣ Back");

        return;
      }

      if (text === "1" || text === "yes") {

        const owner = process.env.OWNER_NUMBER + "@c.us";

        await msg.reply("Thank you. Our team will contact you shortly.");

        await client.sendMessage(
          owner,
          `New order request received.\nCustomer: ${user}`
        );

        botDisabled[user] = true;  // stop only this customer

        return;
      }

      if (text === "2" || text === "no") {

        await msg.reply("Thank you for contacting PurelyJid.");

        botDisabled[user] = true;

        return;
      }

    }

  });

  client.initialize();

}

module.exports = { initWhatsApp };

