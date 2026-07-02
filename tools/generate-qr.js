const QRCode = require("qrcode");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const QR_SIZE = 1000;
const DEFAULT_LOGO = path.join(__dirname, "..", "assets", "logo.png");
// Largeur de la zone de logo, en proportion de la largeur du QR code.
// Reste volontairement modeste pour ne pas nuire à la lisibilité, même
// avec errorCorrectionLevel "H" (tolère ~30% d'occultation).
const LOGO_BOX_WIDTH_RATIO = 0.34;
const LOGO_PADDING_RATIO = 0.14; // marge blanche autour du logo, dans sa zone

const url = process.argv[2];
const output = process.argv[3] || path.join(__dirname, "..", "qr-code.png");
const logoPath = process.argv[4] || DEFAULT_LOGO;

if (!url) {
  console.error(
    "Usage: node tools/generate-qr.js <url> [chemin-de-sortie.png] [chemin-du-logo.png]"
  );
  process.exit(1);
}

async function main() {
  const qrBuffer = await QRCode.toBuffer(url, {
    type: "png",
    errorCorrectionLevel: "H",
    width: QR_SIZE,
    margin: 2,
  });

  const useLogo = logoPath && fs.existsSync(logoPath);
  if (!useLogo) {
    fs.writeFileSync(output, qrBuffer);
    console.log("QR code généré (sans logo) : " + output);
    console.log("URL encodée : " + url);
    return;
  }

  const qrMeta = await sharp(qrBuffer).metadata();
  const logoMeta = await sharp(logoPath).metadata();

  const boxWidth = Math.round(qrMeta.width * LOGO_BOX_WIDTH_RATIO);
  const padding = Math.round(boxWidth * LOGO_PADDING_RATIO);

  const logoWidth = boxWidth - 2 * padding;
  const logoHeight = Math.round(
    logoWidth * (logoMeta.height / logoMeta.width)
  );
  const boxHeight = logoHeight + 2 * padding;
  const radius = Math.round(boxHeight * 0.15);

  const boxSvg = `<svg width="${boxWidth}" height="${boxHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${boxWidth}" height="${boxHeight}" rx="${radius}" ry="${radius}" fill="white"/>
  </svg>`;
  const boxBuffer = await sharp(Buffer.from(boxSvg)).png().toBuffer();

  const resizedLogo = await sharp(logoPath)
    .resize({ width: logoWidth, height: logoHeight, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const boxLeft = Math.round((qrMeta.width - boxWidth) / 2);
  const boxTop = Math.round((qrMeta.height - boxHeight) / 2);
  const logoLeft = boxLeft + Math.round((boxWidth - logoWidth) / 2);
  const logoTop = boxTop + Math.round((boxHeight - logoHeight) / 2);

  await sharp(qrBuffer)
    .composite([
      { input: boxBuffer, left: boxLeft, top: boxTop },
      { input: resizedLogo, left: logoLeft, top: logoTop },
    ])
    .png()
    .toFile(output);

  console.log("QR code généré (avec logo) : " + output);
  console.log("URL encodée : " + url);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
