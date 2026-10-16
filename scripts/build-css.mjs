import {compile} from 'sass';
import {mkdirSync, readdirSync, writeFileSync} from 'node:fs';

mkdirSync('dist/css', {recursive: true});

for (const file of readdirSync('src/scss').filter(f => f.endsWith('.scss') && !f.startsWith('_'))) {
    const out = file.replace('.scss', '.css');
    const {css} = compile(`src/scss/${file}`, {style: 'expanded', silenceDeprecations: ['import']});
    writeFileSync(`dist/css/${out}`, `${css}\n`);
}
