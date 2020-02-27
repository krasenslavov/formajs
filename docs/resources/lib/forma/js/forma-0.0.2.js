/*! FormaJS v0.0.2 | (c) Krasen Slavov | https://formajs.com/#license */
'use strict';

const formajs = {
    options: {
        container: '.forma',
        prefix: 'Enter ',
        suffix: '...',
        tab: false,
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

            this.message.split(';').map(msg => 
                (msg) ? console.error(msg) : '');
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
        (!this.options.tab && !this.options.manual) ? this.options.show = true : '';

        // By default make visible only the first form field.
        (this.options.show) 
            ? this.utils.setProperties(this.utils.__('label', this.form), {'class': 'forma-open'}) 
            : this.utils.setProperties(this.utils.__('label', this.form, 1), {'class': 'forma-open'});

        // Disable form submit button,  
        // can be done also within HTML with disabled.
        (this.options.submit)
            ? this.utils.setProperties(this.utils.__('[type="submit"]', this.form), {'disabled': 'disabled'})
            : ''; 

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
                this.utils.createAndAppend('div', 'forma-description', descText, spanElem);

                (this.options.manual) 
                    ? this.utils.setProperties(currLabel, {'class': currLabel.classList + ' forma-manual'}) 
                    : '';
            }

            if (this.support.indexOf(elemType) === -1) {

                console.error(`The form field '${elemType}' is not supported! Take a look at the documentaion https://formajs.com/.`);
                return false;
            }

            this.listen(elem, currLabel);
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
                        (this.options.tab) 
                            ? Object.values(this.utils.__('label', this.form)).map(el => el.classList.remove('forma-open'))
                            : '';

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
                        this.utils._('[type="submit"]', this.form).disabled = 
                            (this.utils.__('span.forma-invalid', this.form).length === 0 
                                && !elem.validationMessage)
                                    ? false
                                    : true;
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

                            this.utils.createAndAppend('div', 'message', validationMessage, currSpan);
                        }

                        this.utils.toggleClasses(currSpan, 'forma-valid', 'forma-invalid');
                    } else {

                        this.utils.removeElement('div.forma-message', currSpan);
                        this.utils.toggleClasses(currSpan, 'forma-invalid', 'forma-valid');
                    }
                }
            });
        });
    },
    // Extened, system options with user defined
    // Do some checks and add error message show in 
    // the init with console.error.
    extend(options) {

        Object.keys(options).map(key => {

            if (Object.keys(this.options).indexOf(key) === -1) {

                this.message += `Invalid option '${key}'! Take a look at the documentaion https://formajs.com/.`;
                return;
            }
        });

        Object.keys(options).map(key => {

            if (!this.check(options, ['container'], key, 'string')
                || !this.check(options, ['prefix','suffix'], key, 'string')
                || !this.check(options, ['tab','auto','show','manual','submit'], key, 'boolean')
                || !this.check(options, ['support'], key, 'object')) {
                return;                   
            }
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

        (Object.keys(els).length > 0) 
            ? Object.values(els).map(el => 
                Object.keys(props).map(propKey => el.setAttribute(propKey, props[propKey]))
              )
            : Object.keys(props).map(propKey => els.setAttribute(propKey, props[propKey]));
    },
    // newClassName could be an [] which will add multiple classes to the el.
    createAndAppend: function(
        newTag, 
        newClassName = '', 
        newContent = '', 
        appendTo = document) {
        
        let newElem = document.createElement(newTag);
        
        (typeof newClassName === 'string') 
            ? newElem.classList.add(newClassName)
            : Object.values(newClassName).map(className => newElem.classList.add(className));

        newElem.innerHTML = newContent;

        appendTo.append(newElem);
    },
    // addClassName is not required.
    toggleClasses: function(
        el, 
        removeClassName, 
        addClassName = '') {

        (!addClassName) ? addClassName = removeClassName : '';

        (el.classList.contains(removeClassName))
            ? el.classList.remove(removeClassName)
            : el.classList.add(addClassName);
    },
    // selector must be passed as a string.
    removeElement: function(
        selector, 
        context = document.body) {

        (typeof selector === 'string' && this._(selector, context))
            ? this._(selector, context).remove() 
            : '';
    },
    // Detect mobiles devices, some user/system defined 
    // options must overwritten for form to be usable.
    isMobile: function() {

        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
                return true;
        }    

        return false;
    },
};

// Run init.
function forma(options) {
    (document.onreadystatechange = () => {    
        if (document.readyState === 'complete') {   
            formajs.init(options);
        }
    });
}