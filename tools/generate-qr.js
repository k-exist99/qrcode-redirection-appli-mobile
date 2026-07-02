const QRCode = require("qrcode");
const path = require("path");

const url = process.argv[2];
const output = process.argv[3] || path.join(__dirname, "..", "qr-code.png");

if (!url) {
  console.error("Usage: node tools/generate-qr.js <url> [chemin-de-sortie.png]");
  process.exit(1);
}

QRCode.toFile(
  output,
  url,
  {
    type: "png",
    errorCorrectionLevel: "H",
    width: 1000,
    margin: 2,
  },
  function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("QR code généré : " + output);
    console.log("URL encodée : " + url);
  }
);
