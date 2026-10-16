import {cpSync, mkdirSync} from 'node:fs';

// Keep the docs site on the freshly built library.
mkdirSync('docs/resources/lib/forma/js', {recursive: true});
mkdirSync('docs/resources/lib/forma/css', {recursive: true});
cpSync('dist/js/forma.min.js', 'docs/resources/lib/forma/js/forma.min.js');
cpSync('dist/js/forma.js', 'docs/resources/lib/forma/js/forma.js');
cpSync('dist/css', 'docs/resources/lib/forma/css', {recursive: true});
