export interface FormaStructure {
    /** Legend text of the generated fieldset. */
    title?: string;
    /** Add a `*` abbreviation marker to each row label. */
    abbr?: boolean;
    /** Row wrapper element. */
    wrapper?: 'div' | 'section' | 'ul>li';
}

export interface FormaOptions {
    /** CSS selector of the form container. Default `.forma`. */
    container?: string;
    /** Move between rows with the Tab key, one open row at a time. */
    tab?: boolean;
    /** Show all rows. */
    show?: boolean;
    /** Auto-generate placeholders and descriptions from the labels. */
    auto?: boolean;
    /** Add a +/- toggle to every row. */
    manual?: boolean;
    /** Disable the submit button until the form is valid. */
    submit?: boolean;
    /** Text before the label in auto-generated text. Default `Enter`. */
    prefix?: string;
    /** Text after the label in auto-generated text. Default `...`. */
    suffix?: string;
    /** Extra supported elements, e.g. `input[type="tel"]`. */
    support?: string[];
    struct?: FormaStructure;
    /** CSS framework class map. */
    integrate?: '' | 'forma' | 'bootstrap';
}

/** Initialise FormaJS. Returns `false` (and logs to the console) on invalid options or form. */
export function forma(options?: FormaOptions): false | undefined;
export default forma;
