/**
 * ! FormaJS v0.0.4 | (c) Krasen Slavov | https://formajs.com/#license
 *
 * @format
 */

// System options.
const settings = {
	container: ".forma",
	tab: false,
	show: false,
	auto: false,
	manual: false,
	submit: false,
	prefix: "Enter",
	suffix: "...",
	support: [], // see supported
	struct: {}, // see strcuture
	integrate: "" // bootstrap, forma
};

const structure = {
	title: "",
	abbr: false,
	wrapper: "div" // div, section, ul>li
};

const classes = {
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

const supported = [
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

// Forma module.
const f = (function (WINDOW, SETTINGS, STRUCTURE, CLASSES, SUPPORTED) {
	// Global variables.

	const forma = {};
	forma.util = {};

	// Private variables.
	forma.form = [];
	forma.elements = [];
	forma.settings = {};
	forma.structure = {};
	forma.classes = {};
	forma.support = [];
	forma.supportList = "";
	forma.message = "";

	// Public.
	forma.initForma = function (settings) {
		if (settings && !this.extendSettings(settings)) {
			return this.outputErrorMsg(this.message);
		}

		// We are good with the used-defined and passed settings.
		this.settings = Object.assign({}, SETTINGS, settings);

		this.form = document.querySelector(this.settings.container);
		this.elements = this.form;
		this.structure = Object.assign({}, STRUCTURE, this.settings.struct);
		this.support = [...new Set([...SUPPORTED, ...this.settings.support])];
		this.supportList = this.support.join(",");

		if (this.settings.integrate === "bootstrap") {
			// Add Bootstrap4 compatibility.
			const bootstrap = {
				control: "form-control", // 1
				group: "form-group",
				fieldset: "form-fieldset m-3 p-3 bg-light border",
				nextWrapper: "d-flex", // 1
				label: "form-label d-flex flex-column px-3",
				open: "form-open", // 1
				manual: "flex-fill", // 1
				description: "form-description text-dark",
				input: "text-success", // 1
				message: "text-warning", // 1
				valid: "text-success", // 1
				invalid: "text-danger" // 1
			};
			this.classes = Object.assign({}, CLASSES, bootstrap);
		} else {
			this.classes = CLASSES;
		}

		// Do some Settings overrides and actions.
		if (this.isMobile()) {
			this.settings.tab = false;
			this.settings.show = true;
			this.settings.manual = false;
		}

		if (this.settings.show) {
			this.settings.tab = false;
		}

		if (!this.settings.tab && !this.settings.manual) {
			this.settings.show = true;
		}

		if (this.settings.submit) {
			this.form.querySelector('[type="submit"]').setAttribute("disabled", "disabled");
		}

		Object.values(this.elements).map((element) => {
			if (this.support.indexOf(`${element.localName}[type="${element.type}"]`) === -1) {
				this.message += `The form field '${element.localName}[type="${element.type}"]' is not supported! Take a look at the documentaion https://formajs.com/.;`;
			}
		});

		if (this.message) {
			return this.outputErrorMsg(this.message);
		}

		// Now we should have all settings sorted out let us build and execute FormaJS.
		this.buildForma(Object.values(this.elements));
		this.listenForma(Object.values(this.elements));

		if (this.settings.show) {
			const wraps = Object.values(this.form.querySelectorAll(`.${this.classes.wrapper}`));
			wraps.map((element) => element.classList.add(this.classes.open));
		} else {
			this.form.querySelectorAll(`.${this.classes.wrapper}`)[0].classList.add(this.classes.wrapper);
		}

		const firstChild = this.form.querySelectorAll(`.${this.classes.wrapper}`)[0];
		firstChild.classList.add(this.classes.open);

		// Focus on the first form of the page.
		const form = document.querySelectorAll("form")[0];
		form.querySelectorAll(`.${this.classes.wrapper}`)[0].querySelector(`.${this.classes.control}`).focus();
	};

	// Private.
	forma.buildForma = function (elements) {
		let html = (row = manual = text = abbr = fid = "");
		let grouped = false;

		elements.map((element, idx) => {
			if (element.type === "submit" || element.localName === "button") {
				html += element.outerHTML;
				return;
			}

			let { name, title, dataset } = element;

			fid = this.util.stripSpecialChars(dataset.label);

			if (this.settings.auto) {
				text = dataset.value || `${this.settings.prefix} ${dataset.label.toLowerCase()}${this.settings.suffix}`;
			}

			if (this.settings.manual) {
				manual = this.classes.manual;
			}

			if (this.settings.struct.abbr) {
				if (!title) {
					title = dataset.value || `${this.settings.prefix} ${dataset.label.toLowerCase()}${this.settings.suffix}`;
				}

				abbr = `<abbr title="${title}">*</abbr>`;
			}

			this.util.updateObject(
				{
					id: fid.toLowerCase().replace(/ /g, "-"),
					className: this.classes.control, // forma-valid
					tabindex: idx,
					placeholder: text
				},
				element
			);

			const groupClassList = dataset.group ? `${this.classes.group} ${this.classes.group}__${dataset.group}` : "";

			if (!grouped) {
				row = "";
			}

			row += `<label for="${fid.toLowerCase().replace(/ /g, "-")}" class="${manual}">
                    <span class="${this.classes.label}">
                        ${dataset.label} ${abbr}
                        <div class="${this.classes.description}">${text}</div>
                        <div class="${this.classes.input}"></div>
                        <div class="${this.classes.message}"></div>
                    </span>
                    <div class="${this.classes.fieldset}">
                        ${element.outerHTML}
                    </div>
                </label>`;

			if (dataset.group && elements[idx + 1] && elements[idx + 1].dataset.group === dataset.group) {
				grouped = true;
				return;
			}

			grouped = false;

			if (this.settings.struct.wrapper === "ul>li") {
				html += `<li class="${this.classes.wrapper} ${groupClassList}">${row}</li>`;
			} else if (this.settings.struct.wrapper === "section") {
				html += `<section class="${this.classes.wrapper} ${groupClassList}">${row}</section>`;
			} else {
				html += `<div class="${this.classes.wrapper} ${groupClassList}">${row}</div>`; // forma-open
			}
		});

		if (this.settings.struct.wrapper === "ul>li") {
			this.form.innerHTML = `<fieldset class="forma"><legend>${this.structure.title}</legend><ul>${html}</ul></fieldset>`;
		} else {
			this.form.innerHTML = `<fieldset class="forma"><legend>${this.structure.title}</legend>${html}</fieldset>`;
		}
	};

	forma.listenForma = function (elements) {
		elements.map((element, idx) => {
			if (this.settings.manual) {
				// Add manual +/- button on form rows.
				if (["fieldset", "submit"].indexOf(element.type) === -1) {
					const wrapper = element.closest(`.${this.classes.wrapper}`);
					const manual = wrapper.querySelector(`.${this.classes.manual}`);

					manual.addEventListener("click", (event) => {
						if (event.target !== event.currentTarget) {
							return false;
						}

						if (wrapper.classList.contains(this.classes.open)) {
							this.util.toggleClasses([wrapper], "", this.classes.open);
						} else {
							this.util.toggleClasses([wrapper], this.classes.open, "");
						}
					});
				}
			}

			["click", "change", "keydown", "keyup", "focus", "blur"].map((type) => {
				element.addEventListener(type, (event) => {
					if (element.type === "fieldset") {
						return;
					}

					if (type === "keydown") {
						const key = event.keyCode || event.which;

						if (key === 9) {
							event.preventDefault();

							const wrapper = element.closest(`.${this.classes.wrapper}`);
							const nextWrapper = wrapper.nextElementSibling;

							if (nextWrapper && nextWrapper.classList.contains(this.classes.wrapper)) {
								if (this.settings.tab) {
									// ?!? Getting it from the latest defined form.
									this.util.toggleClasses([wrapper], "", this.classes.open);
									this.util.toggleClasses([nextWrapper], this.classes.open, "");
								}

								if (nextWrapper.classList.contains(this.classes.wrapper)) {
									nextWrapper.querySelector(`.${this.classes.control}`).focus();
								}
							} else {
								// Loop throughout the currently focused form.
								const form = element.closest("form");

								const firstChild = form.querySelectorAll(`.${this.classes.wrapper}`)[0];

								if (this.settings.tab) {
									// ?!? Getting it from the latest defined form.
									this.util.toggleClasses([wrapper], "", this.classes.open); // last-child
									this.util.toggleClasses([firstChild], this.classes.open, "");
								}

								firstChild.querySelector(`.${this.classes.control}`).focus();
							}
						}
					} else if (type === "focus") {
						// Switch submit button disabled based on form validations.
						if (this.settings.submit) {
							// ?!? Getting it from the latest defined form.

							if (this.form.querySelectorAll(`.${this.classes.invalid}`).length === 0 && !element.validationMessage) {
								this.form.querySelector('[type="submit"]').removeAttribute("disabled");
							} else {
								this.form.querySelector('[type="submit"]').setAttribute("disabled", "disabled");
							}
						}
					} else {
						const { type, validationMessage, value, title, pattern } = element;

						const wrapper = element.closest(`.${this.classes.wrapper}`);
						const label = wrapper.querySelector("label");
						const span = label.querySelector("span");
						const message = label.querySelector(`div.${this.classes.message}`);
						const input = label.querySelector(`div.${this.classes.input}`);

						if (["checkbox", "radio"].indexOf(type) === -1) {
							input.innerHTML = value;
						}

						if (type === "password" && value.length > 0) {
							input.innerHTML = value.length + " characters";
						}

						if (validationMessage) {
							if (title && pattern) {
								message.innerHTML = title;
							} else {
								message.innerHTML = validationMessage;
							}

							this.util.toggleClasses([span, element], this.classes.invalid, this.classes.valid);
						} else {
							// Reset.
							message.innerHTML = "";
							this.util.toggleClasses([span, element], this.classes.valid, this.classes.invalid);
						}
					}
				});
			});
		});
	};

	forma.extendSettings = function (settings) {
		// Check Settings options.
		Object.keys(settings).map((name) => {
			if (Object.keys(SETTINGS).indexOf(name) === -1) {
				this.message += `Invalid option '${name}'! Take a look at the docs https://formajs.com/`;
				return false;
			}

			return true;
		});

		// Validate Settings option types.
		Object.keys(settings).map((name) => {
			if (
				!this.checkSettingType(settings, ["container"], name, "string") ||
				!this.checkSettingType(settings, ["output"], name, "string") ||
				!this.checkSettingType(settings, ["prefix", "suffix"], name, "string") ||
				!this.checkSettingType(settings, ["tab", "auto", "show", "manual", "submit"], name, "boolean") ||
				!this.checkSettingType(settings, ["support"], name, "object")
			) {
				return false;
			}

			return true;
		});

		if (settings.struct) {
			// Check Structure optoions.
			Object.keys(settings.struct).map((name) => {
				if (Object.keys(STRUCTURE).indexOf(name) === -1) {
					this.message += `Invalid structure option '${name}'! Take a look at the docs https://formajs.com/;`;
					return false;
				}

				return true;
			});

			// Validate Sturcture option types.
			Object.keys(settings.struct).map((name) => {
				if (
					!this.checkSettingType(settings.struct, ["title", "wrapper"], name, "string") ||
					!this.checkSettingType(settings.struct, ["abbr"], name, "boolean")
				) {
					return false;
				}

				return true;
			});

			if (settings.struct.wrapper && ["div", "section", "ul>li"].indexOf(settings.struct.wrapper) === -1) {
				this.message += `Invalid wrapper value! Must be either 'div', 'section', or 'ul>li'.;`;
				return false;
			}
		}

		// Check target container.
		if (settings.container && !document.querySelector(settings.container)) {
			this.message += `Target form container with '${settings.container}' not found wihtin the DOM.;`;
		}

		// Check integration framrwork.
		if (settings.integrate && ["forma", "bootstrap"].indexOf(settings.integrate) === -1) {
			this.message += `Invalid integration! Currently supported frameworks are 'forma' or 'bootstrap'.;`;
		}

		if (this.message) {
			return false;
		}

		return true;
	};

	forma.checkSettingType = function (settings, nameList, name, type) {
		const passedType = typeof settings[name];

		if (nameList.indexOf(name) > -1 && typeof settings[name] !== type) {
			this.message += `Invalid type passed for '${name}, ${passedType} type passed! Must be a ${type}.;`;
			return false;
		}

		return true;
	};

	forma.outputErrorMsg = function (messages) {
		messages.split(";").map((message) => {
			if (message) console.error(message);
			return false;
		});

		return false;
	};

	forma.isMobile = function () {
		if (navigator.maxTouchPoints || "ontouchstart" in document.documentElement) {
			return true;
		}

		return false;
	};

	// Utility and helpers.
	forma.util.updateObject = function (props, element) {
		Object.entries(props).map(([key, value]) => {
			element[key] = value;
		});
	};

	forma.util.toggleClasses = function (elements, add, remove) {
		elements.map((element) => {
			if (add) element.classList.add(add);
			if (remove) element.classList.remove(remove);
		});
	};

	forma.util.stripSpecialChars = function (string) {
		return string.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
	};

	// Constructor.
	return {
		construct: function constructor(settings) {
			forma.initForma(settings);
		}
	};
})(this, settings, structure, classes, supported);

// Public init.
function forma(settings) {
	return f.construct(settings);
}

window.forma = forma;
