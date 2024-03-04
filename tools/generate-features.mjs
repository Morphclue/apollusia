import * as fs from 'fs/promises';

const features = JSON.parse(await fs.readFile('../apps/frontend/src/app/about/features/features.json', 'utf-8'));

const readme = await fs.readFile('../README.md', 'utf-8');

const renderedFeatures = Object.entries(features).map(([key, value]) => renderCategory(key, value)).join('');
console.log(renderedFeatures);

const newReadme = readme.replace(/<!-- features:start -->.*<!-- features:end -->/gms, `<!-- features:start -->\n${renderedFeatures}\n<!-- features:end -->`);
await fs.writeFile('../README.md', newReadme, 'utf-8');

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
  <dt>${feature.title}</dt>
  <dd>${feature.description}</dd>
`;
}

function isApollusiaSupported(feature) {
  return feature.support['Apollusia'] === true;
}
