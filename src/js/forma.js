/*! FormaJS v0.0.2 | (c) Krasen Slavov | https://formajs.com/#license */
const formajs = {
    options: {
        container: '.forma',
        prefix: 'Enter ',
        suffix: '...',
        tab: true,
        auto: false,
        show: false,
        manual: false,
        submit: false,
        support: []
    },
    form: '',
    elements: [],
    support: [
        'input',
        'select',
        'textarea',
        'button',
        'input[type="text"]',
        'input[type="email"]',
        'input[type="password"]',
        'select[type="select-one"]',
        'textarea[type="textarea"]',
        'button[type="submit"]',
    ],
    supportList: '',
    message: '',
    // Init.
    init: function(options) {

        // Extend, validate and print errors for user defined options.
        if (options && !this.extend(options)) {
            this.message.split(';').map(msg => {
                if (msg) console.error(msg);
                return false;
            });
            return false;
        }

        // Assign forma variables.
        this.form = this.utils._(this.options.container);
        this.elements = this.form.elements;
        this.support = [...new Set([...this.support,...this.options.support])];
        this.supportList = this.support.join(',');

        // Keep forms usable for mobile devices & 
        // overwrite some of the options.
        if (this.utils.isMobile()) {
            this.options.tab = false;
            this.options.show = true;
            this.options.manual = false;
        }

        // When tab & manual are off to make the 
        // form usable we should turn on the show option.
        if (!this.options.tab && !this.options.manual) {
            this.options.show = true;
        }

        // By default make visible only the first form field.
        if (this.options.show) {
            this.utils.setProperties(this.utils.__('label', this.form), {'class': 'forma-open'});
        } else {
            this.utils.setProperties(this.utils.__('label', this.form, 1), {'class': 'forma-open'});
        }

        // Disable form submit button,  
        // can be done also within HTML with disabled.
        if (this.options.submit) {
            this.utils.setProperties(this.utils.__('[type="submit"]', this.form), {'disabled': 'disabled'});
        }

        // Add functionality for the end-user to be able 
        // to open/close each field manually; works great when tab is on.
        if (this.options.manual) {

            Object.values(this.utils.__('label', this.form)).map(el => {

                el.addEventListener('click', event => {
            
                    event.preventDefault();
            
                    if (event.target !== event.currentTarget) {
                        return false;
                    }

                    this.utils.toggleClasses(el, 'forma-open');
                    this.utils._(this.supportList, el).focus();
                });
                return true;
            });
        }

        Object.values(this.elements).map((elem, idx) => {

            const {
                localName,
                type
            } = elem;

            let elemType = `${localName}[type="${type}"]`
            let currLabel = elem.closest('label') || '';

            if (currLabel) {

                let spanElem = this.utils._('span', currLabel);
                let descText = (this.options.prefix + spanElem.textContent.toLowerCase() + this.options.suffix).trim();

                this.utils.setProperties(elem, {'tabindex': idx, 'placeholder': descText});

                if (this.options.auto) {
                    this.utils.createAndAppend('div', 'forma-description', descText, spanElem);
                }

                if (this.options.manual) {
                    this.utils.setProperties(currLabel, {'class': currLabel.classList + ' forma-manual'});
                }
            }

            if (this.support.indexOf(elemType) === -1) {
                console.error(`The form field '${elemType}' is not supported! Take a look at the documentaion https://formajs.com/.`);
                return false;
            }

            this.listen(elem, currLabel);

            return true;
        });

        // Auto-focus and highlight first form input element
        // can be done also within HTML with 'autofocus'.
        this.elements[0].click();
        this.elements[0].focus();
    },
    // Listen forma.
    listen: function(elem, currLabel) {

        ['click','change','keyup','keydown','blur','focus'].map(type => {

            elem.addEventListener(type, event => {

                if (type === 'keydown') {
                
                    let key = event.keyCode || event.which;
                
                    if (key === 9) {

                        event.preventDefault();

                        let currLabel = elem.closest('label') || '';
                        let nextLabel = currLabel.nextElementSibling;
                        let nextFieldset = this.utils._('.forma-fieldset', nextLabel);

                        // Apply the show/hide functionality on 
                        // fields only when the tab option is on.
                        if (this.options.tab) {
                            Object.values(this.utils.__('label', this.form)).map(el => 
                                el.classList.remove('forma-open'));
                        }

                        if (nextFieldset) {
                            nextLabel.classList.add('forma-open');
                            this.utils._(this.supportList, nextFieldset).focus();
                        }

                        if (nextLabel.localName !== 'label') {
                            this.form.firstElementChild.classList.add('forma-open');
                            this.utils._(this.support, this.form.firstElementChild).focus();
                        }  
                    }
                } else if (type === 'focus') {

                    // Toggle form submit button state based 
                    // on input data validation.
                    if (this.options.submit) {
                        if (this.utils.__('span.forma-invalid', this.form).length === 0 
                            && !elem.validationMessage) {
                            this.utils._('[type="submit"]', this.form).disabled = false;
                        } else {
                            this.utils._('[type="submit"]', this.form).disabled = true;
                        }
                    }
                } else {

                    const {
                        type,
                        validationMessage,
                        value,
                        title,
                        pattern,
                    } = elem;

                    let currLabel = elem.closest('label') || '';
                    let currSpan = this.utils._('span', currLabel);

                    this.utils.removeElement('div.forma-input', currSpan);
                    this.utils.createAndAppend('div', 'forma-input', value, currSpan);

                    // Instead of showing up the live password on screen
                    // show number of charactes (more secure way!).
                    if (type === 'password' && value.length > 0) {
                        this.utils._('div.forma-input', currSpan).innerHTML = value.length + ' characters';
                    }

                    if (validationMessage) {

                        this.utils.removeElement('div.forma-message', currSpan);

                        if (title && pattern) {
                            this.utils.createAndAppend('div', 'forma-message', title, currSpan);
                            // this.utils.createAndAppend('div', 'forma-message', validationMessage + '<br />' + title, currSpan);
                        } else {
                            this.utils.createAndAppend('div', 'forma-message', validationMessage, currSpan);
                        }

                        this.utils.toggleClasses(currSpan, 'forma-valid', 'forma-invalid');
                    } else {
                        this.utils.removeElement('div.forma-message', currSpan);
                        this.utils.toggleClasses(currSpan, 'forma-invalid', 'forma-valid');
                    }
                }
            });
            return true;
        });
    },
    // Extened, system options with user defined
    // Do some checks and add error message show in 
    // the init with console.error.
    extend(options) {

        Object.keys(options).map(key => {

            if (Object.keys(this.options).indexOf(key) === -1) {
                this.message += `Invalid option '${key}'! Take a look at the documentaion https://formajs.com/.`;
                return false;
            }
            return true;
        });

        Object.keys(options).map(key => {

            if (!this.check(options, ['container'], key, 'string')
                || !this.check(options, ['prefix','suffix'], key, 'string')
                || !this.check(options, ['tab','auto','show','manual','submit'], key, 'boolean')
                || !this.check(options, ['support'], key, 'object')) {
                return false;                   
            }
            return true;
        });

        if (options.container 
            && !this.utils._(options.container)) {
            this.message += `Targeted form container with '${options.container}' not found in the DOM.;`;
        }

        if (this.message) {
            return false;
        }

        // If get here all the validation checks have passed
        // Let us add the passed user-defined options.
        Object.keys(options).map(key => {
            this.options[key] = options[key]; 
            return true;
        });

        return true;
    },
    // Type check used in the options extend function. 
    check: function(opts, keys, key, type) {

        if (keys.indexOf(key) > -1 
            && typeof opts[key] !== type) {
            this.message += (`Invalid type for the '${key}' options! Must be a ${type} (true|false).;`);
            return false;
        }

        return true;
    },
};

// Utility functions and helpers.
formajs.utils = {
    // Basic query selector. 
    _: function(
        selector, 
        context = document) {

        return context.querySelector(selector);
    },
    // If first is 1 then we should get only the 1st elem.
    __: function(
        selector, 
        context = document, 
        first = false) {

        return (first)
            ? context.querySelectorAll(selector)[0]
            : context.querySelectorAll(selector);
    },
    // Should work with multiple elemens & properties.
    // If focus is 1 then focus on element (works only for 1 element).
    setProperties: function(
        els = {}, 
        props = {},
        focus = false) {

        if (Object.keys(els).length > 0) {
            Object.values(els).map(el => {
                Object.keys(props).map(propKey => {
                    el.setAttribute(propKey, props[propKey])
                    return true;
                });
                return true;
            });
        } else {
            Object.keys(props).map(propKey => {
                els.setAttribute(propKey, props[propKey])
                return true;
            });
        }
    },
    // newClassName could be an [] which will add multiple classes to the el.
    createAndAppend: function(
        newTag, 
        newClassName = '', 
        newContent = '', 
        appendTo = document) {
        
        let newElem = document.createElement(newTag);
        
        if (typeof newClassName === 'string') {
            newElem.classList.add(newClassName);
        } else {
            Object.values(newClassName).map(className => {
                newElem.classList.add(className)
                return true;
            });
        }

        newElem.innerHTML = newContent;

        appendTo.append(newElem);
    },
    // addClassName is not required.
    toggleClasses: function(
        el, 
        removeClassName, 
        addClassName = '') {

        if (!addClassName) { 
            addClassName = removeClassName;
        }

        if (el.classList.contains(removeClassName)) {
            el.classList.remove(removeClassName);
        } else {
            el.classList.add(addClassName);
        }
    },
    // selector must be passed as a string.
    removeElement: function(
        selector, 
        context = document.body) {

        if (typeof selector === 'string' && this._(selector, context)) {
            this._(selector, context).remove();
        }
    },
    // Detect mobiles devices, some user/system defined 
    // options must overwritten for form to be usable.
    isMobile: function() {

        if (navigator.maxTouchPoints 
            || 'ontouchstart' in document.documentElement) { 
            return true;
        }    

        return false;
    },
}

// Run init.
function forma(options) {
    formajs.init(options);
}
window.forma = forma;