// @vitest-environment jsdom
import {describe, it, expect, beforeEach, vi} from 'vitest';
import forma from '../src/js/forma.js';

const form = (cls = 'forma', extra = '') => `
  <form class="${cls}">
    <input data-label="Email Address" type="email" name="email" required />
    <input data-label="Full Name" type="text" name="name" ${extra} />
    <button type="submit">Send</button>
  </form>`;

beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
});

describe('options', () => {
    it('rejects unknown options and logs an error', () => {
        document.body.innerHTML = form();
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(forma({nope: true})).toBe(false);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('rejects wrong types and a missing container', () => {
        document.body.innerHTML = form();
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(forma({tab: 'yes'})).toBe(false);
        expect(forma({container: '.missing'})).toBe(false);
        expect(forma({struct: {wrapper: 'p'}})).toBe(false);
        expect(spy).toHaveBeenCalledTimes(3);
    });

    it('does not carry errors over to the next call', () => {
        document.body.innerHTML = form();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        forma({nope: true});
        expect(forma()).not.toBe(false);
    });

    it('rejects unsupported fields unless added with `support`', () => {
        document.body.innerHTML = '<form class="forma"><input data-label="Phone" type="tel" /></form>';
        vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(forma()).toBe(false);
        expect(forma({support: ['input[type="tel"]']})).not.toBe(false);
    });
});

describe('rendering', () => {
    it('wraps every field in a row with label, description and message', () => {
        document.body.innerHTML = form();
        forma({auto: true});
        const rows = document.querySelectorAll('.forma-wrap');
        expect(rows).toHaveLength(2);
        expect(rows[0].querySelector('.forma-description').textContent).toBe('Enter email address...');
        expect(document.querySelector('#email-address').placeholder).toBe('Enter email address...');
        expect(document.querySelector('[type="submit"]')).not.toBeNull();
    });

    it('opens every row with `show`, only the first otherwise (tab)', () => {
        document.body.innerHTML = form();
        forma({show: true});
        expect(document.querySelectorAll('.forma-open')).toHaveLength(2);
        document.body.innerHTML = form();
        forma({tab: true});
        expect(document.querySelectorAll('.forma-open')).toHaveLength(1);
    });

    it('supports section and ul>li wrappers and the legend title', () => {
        document.body.innerHTML = form();
        forma({struct: {wrapper: 'ul>li', title: 'Sign up'}});
        expect(document.querySelectorAll('ul > li.forma-wrap')).toHaveLength(2);
        expect(document.querySelector('legend').textContent).toBe('Sign up');
    });

    it('groups fields with the same data-group in one row', () => {
        document.body.innerHTML = `<form class="forma">
          <input data-label="First" data-group="name" type="text" />
          <input data-label="Last" data-group="name" type="text" />
          <input data-label="Mail" type="email" /></form>`;
        forma();
        expect(document.querySelectorAll('.forma-wrap')).toHaveLength(2);
        expect(document.querySelectorAll('.forma-group__name input')).toHaveLength(2);
    });

    it('does not throw without a submit button or a data-label', () => {
        document.body.innerHTML = '<form class="forma"><input type="text" name="plain" /></form>';
        expect(() => forma({submit: true})).not.toThrow();
    });

    it('does not leak globals', () => {
        document.body.innerHTML = form();
        forma();
        for (const name of ['row', 'manual', 'text', 'abbr', 'fid']) {
            expect(name in globalThis).toBe(false);
        }
    });

    it('keeps ids unique across forms with identical labels', () => {
        document.body.innerHTML = form('forma forma-a') + form('forma forma-b');
        forma({container: '.forma-a'});
        forma({container: '.forma-b'});
        const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe('behaviour', () => {
    const type = (el, value) => {
        el.value = value;
        el.dispatchEvent(new Event('input', {bubbles: true}));
    };

    it('echoes input as text, never as HTML (XSS)', () => {
        document.body.innerHTML = form();
        forma();
        const input = document.querySelector('#full-name');
        type(input, '<img src=x onerror=alert(1)>');
        const echo = input.closest('.forma-wrap').querySelector('.forma-input');
        expect(echo.querySelector('img')).toBeNull();
        expect(echo.textContent).toBe('<img src=x onerror=alert(1)>');
    });

    it('escapes labels from markup', () => {
        document.body.innerHTML = '<form class="forma"><input data-label=\'A"><img src=x>\' type="text" /></form>';
        forma();
        expect(document.querySelector('.forma-label img')).toBeNull();
    });

    it('marks invalid fields and sets aria-invalid', () => {
        document.body.innerHTML = form();
        forma();
        const email = document.querySelector('#email-address');
        type(email, 'not-an-email');
        expect(email.classList.contains('forma-invalid')).toBe(true);
        expect(email.getAttribute('aria-invalid')).toBe('true');
        type(email, 'a@b.co');
        expect(email.classList.contains('forma-valid')).toBe(true);
        expect(email.hasAttribute('aria-invalid')).toBe(false);
    });

    it('disables submit until the form is valid', () => {
        document.body.innerHTML = form();
        forma({submit: true});
        const button = document.querySelector('[type="submit"]');
        expect(button.disabled).toBe(true);
        type(document.querySelector('#email-address'), 'a@b.co');
        expect(button.disabled).toBe(false);
    });

    it('moves to the next row on Tab when `tab` is on, and not otherwise', () => {
        document.body.innerHTML = form();
        forma({tab: true});
        const [first, second] = document.querySelectorAll('.forma-wrap');
        const key = new KeyboardEvent('keydown', {key: 'Tab', bubbles: true, cancelable: true});
        first.querySelector('input').dispatchEvent(key);
        expect(key.defaultPrevented).toBe(true);
        expect(second.classList.contains('forma-open')).toBe(true);
        expect(first.classList.contains('forma-open')).toBe(false);

        document.body.innerHTML = form();
        forma({show: true});
        const free = new KeyboardEvent('keydown', {key: 'Tab', bubbles: true, cancelable: true});
        document.querySelector('input').dispatchEvent(free);
        expect(free.defaultPrevented).toBe(false);
    });

    it('lets Tab leave the last row and ignores Shift+Tab', () => {
        document.body.innerHTML = form();
        forma({tab: true});
        const rows = document.querySelectorAll('.forma-wrap');
        const last = new KeyboardEvent('keydown', {key: 'Tab', bubbles: true, cancelable: true});
        rows[1].querySelector('input').dispatchEvent(last);
        expect(last.defaultPrevented).toBe(false);
        const back = new KeyboardEvent('keydown', {key: 'Tab', shiftKey: true, bubbles: true, cancelable: true});
        rows[0].querySelector('input').dispatchEvent(back);
        expect(back.defaultPrevented).toBe(false);
    });

    it('toggles a row with `manual`', () => {
        document.body.innerHTML = form();
        forma({manual: true});
        const row = document.querySelectorAll('.forma-wrap')[1];
        expect(row.classList.contains('forma-open')).toBe(false);
        row.querySelector('label').click();
        expect(row.classList.contains('forma-open')).toBe(true);
    });

    it('keeps instances independent', () => {
        document.body.innerHTML = form('forma a') + form('forma b');
        forma({container: '.a', show: true});
        forma({container: '.b', tab: true});
        expect(document.querySelectorAll('.a .forma-open')).toHaveLength(2);
        expect(document.querySelectorAll('.b .forma-open')).toHaveLength(1);
        const key = new KeyboardEvent('keydown', {key: 'Tab', bubbles: true, cancelable: true});
        document.querySelector('.a input').dispatchEvent(key);
        expect(key.defaultPrevented).toBe(false);
    });
});
