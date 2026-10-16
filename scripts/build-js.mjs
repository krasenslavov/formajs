import {build, context} from 'esbuild';
import {readFileSync} from 'node:fs';

const {version} = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
const banner = `/*! FormaJS v${version} | (c) Krasen Slavov | MIT | https://formajs.krasenslavov.com/ */`;
const entry = 'src/js/forma.js';

const common = {entryPoints: [entry], bundle: true, banner: {js: banner}, legalComments: 'none', target: 'es2018'};

// Browser build: exposes `window.forma` as a function.
const iife = {
    ...common,
    format: 'iife',
    globalName: '__forma',
    footer: {js: 'window.forma=__forma.default;'},
    outfile: 'dist/js/forma.min.js',
    minify: true
};

const builds = [
    {...common, format: 'esm', outfile: 'dist/js/forma.esm.js'},
    {...common, format: 'cjs', outfile: 'dist/js/forma.cjs', footer: {js: 'module.exports=module.exports.default;module.exports.default=module.exports;module.exports.forma=module.exports;'}},
    iife,
    {...iife, minify: false, outfile: 'dist/js/forma.js'}
];

if (process.argv.includes('--watch')) {
    for (const options of builds) await (await context(options)).watch();
} else {
    for (const options of builds) await build(options);
}
