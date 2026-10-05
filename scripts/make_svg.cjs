const fs = require('fs');
const paths = JSON.parse(fs.readFileSync('C:/Users/lepps/OneDrive/Desktop/mchengenharia_imobiliaria/src/components/emblem_paths.json', 'utf8'));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="30 40 225 210" width="480" height="448">
  <defs>
    <linearGradient id="silverGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8E9399" />
      <stop offset="50%" stop-color="#B2B6BA" />
      <stop offset="100%" stop-color="#80848A" />
    </linearGradient>
    <linearGradient id="silverGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A5A9AD" />
      <stop offset="100%" stop-color="#82868C" />
    </linearGradient>
    <linearGradient id="silverGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B8BCBF" />
      <stop offset="100%" stop-color="#93979C" />
    </linearGradient>
  </defs>

  <!-- 1. Central Tower Left (Dark Navy) -->
  <path d="${paths.pathTowerLeft}" fill="#1B2639" />

  <!-- 2. Central Tower Right (Silver Gradient) -->
  <path d="${paths.pathTowerRight}" fill="url(#silverGrad2)" />

  <!-- 3. Third Tier Building (Silver Gradient) -->
  <path d="${paths.pathTowerTier3}" fill="url(#silverGrad3)" />

  <!-- 4. Inner Left Diagonal (Silver Gradient) -->
  <path d="${paths.pathSilverDiagonal}" fill="url(#silverGrad1)" />

  <!-- 5. Inner Right M (Dark Navy) -->
  <path d="${paths.pathInnerRightM}" fill="#1B2639" />

  <!-- 6. Outer M (Dark Navy) -->
  <path d="${paths.pathOuterM}" fill="#1B2639" />
</svg>`;

fs.writeFileSync('C:/Users/lepps/OneDrive/Desktop/mchengenharia_imobiliaria/public/test_emblem.svg', svg);
fs.writeFileSync('C:/Users/lepps/OneDrive/Desktop/mchengenharia_imobiliaria/public/favicon.svg', svg);
console.log('Saved test_emblem.svg and favicon.svg successfully');
