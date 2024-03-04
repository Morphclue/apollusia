import * as fs from 'fs/promises';

const features = JSON.parse(await fs.readFile('../apps/frontend/src/app/about/features/features.json', 'utf-8'));

const readme = await fs.readFile('../README.md', 'utf-8');

const renderedFeatures = Object.entries(features).map(([key, value]) => renderCategory(key, value)).join('');

const newReadme = readme.replace(/<!-- features:start -->.*<!-- features:end -->/gms, `<!-- features:start -->\n${renderedFeatures}\n<!-- features:end -->`);
await fs.writeFile('../README.md', newReadme, 'utf-8');

await fs.mkdir('../docs/bootstrap-icons/icons', {recursive: true});
await fs.copyFile('../node_modules/bootstrap-icons/LICENSE', '../docs/bootstrap-icons/LICENSE');

const icons = new Set(Object.values(features).flatMap(f => f).map(f => f.icon));
for (const icon of icons) {
  const svg = await fs.readFile(`../node_modules/bootstrap-icons/icons/${icon}.svg`, 'utf-8');
  const modified = svg.replace('fill="currentColor"', 'fill="#b080d9"'); // text-primary-emphasis
  await fs.writeFile(`../docs/bootstrap-icons/icons/${icon}.svg`, modified, 'utf-8');
}

function renderCategory(key, features) {
  if (!features.some(isApollusiaSupported)) {
    return '';
  }

  return `\
### ${key}

<dl>
${features.map(f => renderFeature(f)).join('')}\
</dl>

`;
}

function renderFeature(feature) {
  if (!isApollusiaSupported(feature)) {
    return '';
  }

  return `\
  <img src="docs/bootstrap-icons/icons/${feature.icon}.svg" alt="${feature.icon}" align="right" height="50">
  <dt>${feature.title}</dt>
  <dd>${feature.description}</dd>
`;
}

function isApollusiaSupported(feature) {
  return feature.support['Apollusia'] === true;
}
