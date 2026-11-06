const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function setupIcons() {
  console.log('🎨 Starting WeatherGuru Gold launcher icon generation...');
  const svgPath = path.join(__dirname, '..', 'public', 'logo.svg');
  if (!fs.existsSync(svgPath)) {
    console.error('public/logo.svg not found!');
    return;
  }

  const svgBuffer = fs.readFileSync(svgPath);

  // 1. Generate all public web icons
  const publicIcons = [
    { name: 'icon-48.png', size: 48 },
    { name: 'icon-72.png', size: 72 },
    { name: 'icon-96.png', size: 96 },
    { name: 'icon-144.png', size: 144 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon.png', size: 64 },
  ];

  for (const icon of publicIcons) {
    const outPath = path.join(__dirname, '..', 'public', icon.name);
    await sharp(svgBuffer).resize(icon.size, icon.size).png().toFile(outPath);
  }
  console.log('✅ Generated all public web PNG icons.');

  // 2. Android Native mipmap setup
  const androidResDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
  if (!fs.existsSync(androidResDir)) {
    console.log('ℹ️ android directory not present yet. Skipping Android copy.');
    return;
  }

  const mipmapConfigs = [
    { folder: 'mipmap-mdpi', size: 48, fgSize: 108 },
    { folder: 'mipmap-hdpi', size: 72, fgSize: 162 },
    { folder: 'mipmap-xhdpi', size: 96, fgSize: 216 },
    { folder: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
    { folder: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
  ];

  for (const config of mipmapConfigs) {
    const targetDir = path.join(androidResDir, config.folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Standard icon
    await sharp(svgBuffer)
      .resize(config.size, config.size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // Round icon
    await sharp(svgBuffer)
      .resize(config.size, config.size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    // Foreground icon with safe margin (adaptive icon standard)
    const innerSize = Math.round(config.fgSize * 0.72);
    const innerBuffer = await sharp(svgBuffer).resize(innerSize, innerSize).png().toBuffer();
    await sharp({
      create: {
        width: config.fgSize,
        height: config.fgSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: innerBuffer, gravity: 'centre' }])
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    console.log(`✅ Configured ${config.folder} (${config.size}x${config.size})`);
  }

  // Update background color in Android res/values/ic_launcher_background.xml
  const valuesDir = path.join(androidResDir, 'values');
  if (!fs.existsSync(valuesDir)) {
    fs.mkdirSync(valuesDir, { recursive: true });
  }

  const bgXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#0f766e</color>
</resources>
`;
  fs.writeFileSync(path.join(valuesDir, 'ic_launcher_background.xml'), bgXml, 'utf8');

  // Update strings.xml for app name
  const stringsPath = path.join(valuesDir, 'strings.xml');
  if (fs.existsSync(stringsPath)) {
    let stringsXml = fs.readFileSync(stringsPath, 'utf8');
    stringsXml = stringsXml.replace(
      /<string name="app_name">.*?<\/string>/,
      '<string name="app_name">WeatherGuru Gold</string>'
    );
    stringsXml = stringsXml.replace(
      /<string name="title_activity_main">.*?<\/string>/,
      '<string name="title_activity_main">WeatherGuru Gold</string>'
    );
    fs.writeFileSync(stringsPath, stringsXml, 'utf8');
  }

  console.log('🎉 WeatherGuru Gold Android launcher icons configured successfully!');
}

setupIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
