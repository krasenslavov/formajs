/*! FormaJS v1.0.0 | (c) Krasen Slavov | MIT | https://formajs.krasenslavov.com/ */
var __forma = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/js/forma.js
  var forma_exports = {};
  __export(forma_exports, {
    default: () => forma_default,
    forma: () => forma
  });
  var DOCS_URL = "https://formajs.krasenslavov.com/";
  var SETTINGS = {
    container: ".forma",
    tab: false,
    show: false,
    auto: false,
    manual: false,
    submit: false,
    prefix: "Enter",
    suffix: "...",
    support: [],
    // see SUPPORTED
    struct: {},
    // see STRUCTURE
    integrate: ""
    // bootstrap, forma
  };
  var STRUCTURE = {
    title: "",
    abbr: false,
    wrapper: "div"
    // div, section, ul>li
  };
  var CLASSES = {
    control: "forma-control",
    group: "forma-group",
    fieldset: "forma-fieldset",
    wrapper: "forma-wrap",
    label: "forma-label",
    open: "forma-open",
    manual: "forma-manual",
    description: "forma-description",
    input: "forma-input",
    message: "forma-message",
    valid: "forma-valid",
    invalid: "forma-invalid"
  };
  var BOOTSTRAP = {
    group: "form-group",
    fieldset: "form-fieldset m-3 p-3 bg-light border",
    label: "form-label d-flex flex-column px-3",
    open: "form-open",
    manual: "flex-fill",
    description: "form-description text-dark",
    input: "text-success",
    message: "text-warning",
    valid: "text-success",
    invalid: "text-danger",
    control: "form-control"
  };
  var SUPPORTED = [
    "input",
    "select",
    "textarea",
    "button",
    "fieldset",
    'input[type="text"]',
    // 'input[type="checkbox"]',
    // 'input[type="radio"]',
    'input[type="email"]',
    'input[type="number"]',
    'input[type="url"]',
    'input[type="date"]',
    'input[type="password"]',
    'select[type="select-one"]',
    'textarea[type="textarea"]',
    'button[type="submit"]',
    'fieldset[type="fieldset"]'
  ];
  var WRAPPERS = ["div", "section", "ul>li"];
  var INTEGRATIONS = ["forma", "bootstrap"];
  var instanceCount = 0;
  var util = {
    escapeHTML(value) {
      return String(value === void 0 || value === null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },
    stripSpecialChars(string) {
      return String(string).replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, "");
    },
    slug(string) {
      return util.stripSpecialChars(string).trim().toLowerCase().replace(/\s+/g, "-");
    },
    toggleClasses(elements, add, remove) {
      elements.forEach((element) => {
        if (add) element.classList.add(...add.split(" "));
        if (remove) element.classList.remove(...remove.split(" "));
      });
    },
    // Touch-first devices (phones, tablets) – not touch-capable laptops.
    isMobile() {
      return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
    }
  };
  function validateSettings(settings) {
    const errors = [];
    const types = {
      container: "string",
      prefix: "string",
      suffix: "string",
      integrate: "string",
      tab: "boolean",
      auto: "boolean",
      show: "boolean",
      manual: "boolean",
      submit: "boolean",
      support: "array",
      struct: "object"
    };
    const typeOf = (value) => Array.isArray(value) ? "array" : value === null ? "null" : typeof value;
    Object.keys(settings).forEach((name) => {
      if (!(name in SETTINGS)) {
        errors.push(`Invalid option '${name}'! Take a look at the docs ${DOCS_URL}`);
      } else if (typeOf(settings[name]) !== types[name]) {
        errors.push(`Invalid type passed for '${name}', ${typeOf(settings[name])} type passed! Must be a ${types[name]}.`);
      }
    });
    const struct = settings.struct;
    if (struct && typeOf(struct) === "object") {
      const structTypes = { title: "string", wrapper: "string", abbr: "boolean" };
      Object.keys(struct).forEach((name) => {
        if (!(name in STRUCTURE)) {
          errors.push(`Invalid structure option '${name}'! Take a look at the docs ${DOCS_URL}`);
        } else if (typeof struct[name] !== structTypes[name]) {
          errors.push(`Invalid type passed for '${name}', ${typeof struct[name]} type passed! Must be a ${structTypes[name]}.`);
        }
      });
      if (typeof struct.wrapper === "string" && !WRAPPERS.includes(struct.wrapper)) {
        errors.push(`Invalid wrapper value! Must be either 'div', 'section', or 'ul>li'.`);
      }
    }
    if (typeof settings.container === "string") {
      let found = null;
      try {
        found = document.querySelector(settings.container);
      } catch (e) {
        errors.push(`Invalid container selector '${settings.container}'.`);
        return errors;
      }
      if (!found) {
        errors.push(`Target form container with '${settings.container}' not found within the DOM.`);
      }
    }
    if (settings.integrate && typeof settings.integrate === "string" && !INTEGRATIONS.includes(settings.integrate)) {
      errors.push(`Invalid integration! Currently supported frameworks are 'forma' or 'bootstrap'.`);
    }
    return errors;
  }
  function report(errors) {
    errors.forEach((message) => console.error(message));
    return false;
  }
  function build(ctx, controls) {
    const { settings, structure, classes } = ctx;
    const esc = util.escapeHTML;
    const used = /* @__PURE__ */ new Set();
    let html = "";
    let row = "";
    let grouped = false;
    controls.forEach((element, idx) => {
      if (element.type === "fieldset") {
        return;
      }
      if (element.type === "submit" || element.localName === "button") {
        html += element.outerHTML;
        return;
      }
      const { dataset } = element;
      const label = dataset.label || element.name || element.type;
      const lowerLabel = String(label).toLowerCase();
      const autoText = dataset.value || `${settings.prefix} ${lowerLabel}${settings.suffix}`;
      const text = settings.auto ? autoText : "";
      let id = util.slug(label) || `field-${idx}`;
      if (used.has(id) || document.getElementById(id) && document.getElementById(id) !== element) {
        id = `${id}-${ctx.uid}-${idx}`;
      }
      used.add(id);
      let abbr = "";
      if (structure.abbr) {
        abbr = `<abbr title="${esc(element.title || autoText)}">*</abbr>`;
      }
      element.id = id;
      element.classList.add(...classes.control.split(" "));
      if (settings.auto) {
        element.placeholder = text;
      }
      element.setAttribute("aria-labelledby", `${id}-label`);
      element.setAttribute("aria-describedby", `${id}-description ${id}-message`);
      element.removeAttribute("tabindex");
      const manual = settings.manual ? classes.manual : "";
      const groupClassList = dataset.group ? `${classes.group} ${classes.group}__${esc(dataset.group)}` : "";
      if (!grouped) {
        row = "";
      }
      row += `<label for="${esc(id)}" class="${esc(manual)}">
                <span class="${esc(classes.label)}"><span id="${esc(id)}-label">${esc(label)}</span> ${abbr}
                    <span class="${esc(classes.description)}" id="${esc(id)}-description">${esc(text)}</span>
                    <span class="${esc(classes.input)}"></span>
                    <span class="${esc(classes.message)}" id="${esc(id)}-message" aria-live="polite"></span>
                </span>
                <span class="${esc(classes.fieldset)}">
                    ${element.outerHTML}
                </span>
            </label>`;
      const next = controls[idx + 1];
      if (dataset.group && next && next.dataset && next.dataset.group === dataset.group) {
        grouped = true;
        return;
      }
      grouped = false;
      const tag = { "ul>li": "li", section: "section" }[structure.wrapper] || "div";
      html += `<${tag} class="${esc(classes.wrapper)} ${groupClassList}">${row}</${tag}>`;
    });
    const title = esc(structure.title);
    const inner = structure.wrapper === "ul>li" ? `<ul>${html}</ul>` : html;
    return `<fieldset class="forma"><legend>${title}</legend>${inner}</fieldset>`;
  }
  function listen(ctx, controls) {
    const { settings, classes, form } = ctx;
    const submitButton = form.querySelector('[type="submit"]');
    const rows = () => Array.from(form.querySelectorAll(`.${classes.wrapper}`));
    const focusRow = (row) => {
      const control = row && row.querySelector(`.${classes.control.split(" ")[0]}`);
      if (control) control.focus();
      return !!control;
    };
    const updateSubmit = (element) => {
      if (!settings.submit || !submitButton) return;
      const invalid = form.querySelectorAll(`.${classes.invalid.split(" ")[0]}`).length > 0;
      const complete = form.checkValidity ? form.checkValidity() : !element.validationMessage;
      submitButton.disabled = invalid || !complete;
    };
    controls.forEach((element) => {
      if (element.type === "fieldset" || element.type === "submit" || element.localName === "button") {
        return;
      }
      const wrapper = element.closest(`.${classes.wrapper}`);
      if (settings.manual) {
        const toggle = wrapper.querySelector(`label.${classes.manual.split(" ")[0]}`);
        if (toggle) {
          toggle.addEventListener("click", (event) => {
            if (event.target === event.currentTarget) {
              wrapper.classList.toggle(classes.open.split(" ")[0]);
            }
          });
        }
      }
      element.addEventListener("keydown", (event) => {
        if (!settings.tab || event.key !== "Tab" || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
          return;
        }
        const all = rows();
        const current = element.closest(`.${classes.wrapper}`);
        const next = all[all.indexOf(current) + 1];
        if (!next) {
          return;
        }
        event.preventDefault();
        current.classList.remove(classes.open);
        next.classList.add(classes.open);
        focusRow(next);
      });
      element.addEventListener("focus", () => updateSubmit(element));
      ["input", "change", "keyup", "blur"].forEach((type) => {
        element.addEventListener(type, () => {
          const row = element.closest(`.${classes.wrapper}`);
          const span = row.querySelector(`.${classes.label.split(" ")[0]}`);
          const message = row.querySelector(`.${classes.message.split(" ")[0]}`);
          const echo = row.querySelector(`.${classes.input.split(" ")[0]}`);
          const { type: kind, validationMessage, value, title, pattern } = element;
          if (["checkbox", "radio"].indexOf(kind) === -1) {
            echo.textContent = kind === "password" && value.length > 0 ? `${value.length} characters` : value;
          }
          if (validationMessage) {
            message.textContent = title && pattern ? title : validationMessage;
            util.toggleClasses([span, element], classes.invalid, classes.valid);
            element.setAttribute("aria-invalid", "true");
          } else {
            message.textContent = "";
            util.toggleClasses([span, element], classes.valid, classes.invalid);
            element.removeAttribute("aria-invalid");
          }
          updateSubmit(element);
        });
      });
    });
  }
  function init(options) {
    const errors = options ? validateSettings(options) : [];
    if (errors.length) {
      return report(errors);
    }
    const settings = Object.assign({}, SETTINGS, options);
    const form = document.querySelector(settings.container);
    const structure = Object.assign({}, STRUCTURE, settings.struct);
    const support = [.../* @__PURE__ */ new Set([...SUPPORTED, ...settings.support])];
    const classes = settings.integrate === "bootstrap" ? Object.assign({}, CLASSES, BOOTSTRAP) : CLASSES;
    if (util.isMobile()) {
      settings.tab = false;
      settings.show = true;
      settings.manual = false;
    }
    if (settings.show) {
      settings.tab = false;
    }
    if (!settings.tab && !settings.manual) {
      settings.show = true;
    }
    const elements = Array.from(form.elements || form.querySelectorAll("input,select,textarea,button,fieldset"));
    const unsupported = elements.filter((element) => support.indexOf(`${element.localName}[type="${element.type}"]`) === -1).map((element) => `The form field '${element.localName}[type="${element.type}"]' is not supported! Take a look at the documentation ${DOCS_URL}`);
    if (unsupported.length) {
      return report(unsupported);
    }
    const ctx = { settings, structure, classes, form, uid: ++instanceCount };
    form.innerHTML = build(ctx, elements);
    const controls = Array.from(form.querySelectorAll("input,select,textarea,button,fieldset"));
    const submitButton = form.querySelector('[type="submit"]');
    if (settings.submit && submitButton) {
      submitButton.disabled = true;
    }
    listen(ctx, controls);
    const wraps = Array.from(form.querySelectorAll(`.${classes.wrapper}`));
    const openClass = classes.open.split(" ");
    if (settings.show) {
      wraps.forEach((wrap) => wrap.classList.add(...openClass));
    } else if (wraps[0]) {
      wraps[0].classList.add(...openClass);
    }
    const first = wraps[0] && wraps[0].querySelector(`.${classes.control.split(" ")[0]}`);
    if (first) first.focus();
  }
  function forma(options) {
    return init(options);
  }
  var forma_default = forma;
  return __toCommonJS(forma_exports);
})();
window.forma=__forma.default;
