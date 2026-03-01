const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const pngToIco = require('png-to-ico');

const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');
const SVG_PATH = path.join(ASSETS, 'caroline-win-icon.svg');

const SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

async function main() {
  const svg = fs.readFileSync(SVG_PATH);

  for (const { size, name } of SIZES) {
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: size },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    fs.writeFileSync(path.join(ASSETS, name), pngBuffer);
    console.log(`Wrote assets/${name}`);
  }

  const icoSizes = [16, 32, 48];
  const icoBuffers = icoSizes.map((s) => {
    const name = `favicon-${s}x${s}.png`;
    return fs.readFileSync(path.join(ASSETS, name));
  });
  const ico = await pngToIco(icoBuffers);
  fs.writeFileSync(path.join(ROOT, 'favicon.ico'), ico);
  console.log('Wrote favicon.ico');

  fs.copyFileSync(SVG_PATH, path.join(ROOT, 'favicon.svg'));
  console.log('Wrote favicon.svg');

  console.log('Favicons generated.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
