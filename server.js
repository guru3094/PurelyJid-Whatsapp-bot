const express = require("express");
require("dotenv").config();

const { initWhatsApp } = require("./services/whatsappService");

const app = express();

const PORT = process.env.PORT || 3000;

initWhatsApp();

app.listen(PORT, () => {

  console.log(`Server running on ${PORT}`);

});

