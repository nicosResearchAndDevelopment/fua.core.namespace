module.exports = () => {

    const
        modes = new Set(["none", "strict"])
    ;

    class Namespace {

        #fua       = global['fua'];
        #mode      = "strict";
        #base      = undefined;
        #vocab     = undefined;
        #uriMap    = new Map();
        #namespace = new Map();

        constructor({
                        'namespace': namespace,
                        'mode':      mode = "strict"
                    }) {
            if (!modes.has(mode))
                throw new Error(`unknown mode <${mode}>`);

            this.#mode = mode;

            this.add(namespace);

        } // constructor

        set base(base) {
            this.#base = base;
        }

        set vocab(vocab) {
            this.#vocab = vocab;
        }

        static get modes() {
            return modes;
        }

        get mode() {
            return this.#mode;
        }

        add(namespace) {
            let
                _namespace = {},
                type       = ((Array.isArray(namespace)) ? "array" : (typeof namespace))
            ;

            if (type === "array") {
                namespace.map((n) => {
                    _namespace[n[0]] = n[1];
                });
                type = "object";
            } else {
                _namespace = namespace;
            } // if ()

            switch (type) {
                case "object":
                    for (const [prefix, uri] of Object.entries(_namespace)) {
                        let
                            uriFromNamespace = this.#namespace.get(prefix),
                            prefixFromUriMap = this.#uriMap.get(uri),
                            prefixIsOk       = false,
                            uriIsOk          = false
                        ;
                        switch (this.#mode) {
                            case "strict":
                            default:
                                if (uriFromNamespace) {
                                    if (uri !== uriFromNamespace)
                                        throw new Error(`given uri <${uri}> (prefix: "${prefix}") differs from uri <${uriFromNamespace}>`);
                                    uriIsOk = true;
                                } else {
                                    uriIsOk = true;
                                } // if ()
                                if (prefixFromUriMap) {
                                    if (prefix !== prefixFromUriMap)
                                        throw new Error(`given prefix "${prefix}" (uri: <${uri}>) differs from prefix "${prefixFromUriMap}"`);
                                    prefixIsOk = true;
                                } else {
                                    prefixIsOk = true;
                                } // if ()
                                if (!uriFromNamespace && !prefixFromUriMap && uriIsOk && prefixIsOk)
                                    this.#namespace.set(prefix, uri);

                                if (!uriFromNamespace)
                                    this.#uriMap.set(uri, prefix);

                                break; // default
                        } // switch (mode)
                    } //for ([prefix, uri])
                    break; // object
                case "undefined":
                default :
                    throw new Error(`unknown type of given namespace`);
                    break; // default
            } // switch (type)
        } // add(namespace)

        context(type, addBase /** addVocab */) {

            addBase = ((typeof addBase === "boolean") ? ((this.#base) ? this.#base : false) : addBase);
            //addVocab = ((typeof addVocab === "boolean") ? ((this.#vocab) ? this.#base : false) : addVocab);

            let
                result
            ;

            switch (type) {
                case "turtle":
                case "text/turtle":
                    result = "";
                    this.#namespace.forEach((uri, prefix, map) => {
                        result = `${result}@prefix ${prefix}: <${uri}> .\n`;
                    });
                    if (addBase)
                        result = `${result}# base\n`;
                    result = `${result}@prefix : <${addBase}> .\n`;
                    //if (addVocab)
                    //    result['@vocab'] = addVocab;
                    result = `${result}\n`;
                    break; // turtle
                case "array":
                    // TODO: base, vocab
                    result = [...this.#namespace];
                    if (addBase)
                        result.push([":", addBase]);
                    //if (addVocab)
                    //    result['@vocab'] = addVocab;
                    break; // array
                case "json":
                case "application/json":
                case "ld+json":
                case "application/ld+json":
                default:
                    result = {};
                    result = Object.fromEntries(this.#namespace);
                    if (addBase)
                        result['@base'] = addBase;
                    //if (addVocab)
                    //    result['@vocab'] = addVocab;
                    break; // default
            } // switch(type)
            return result;
        } // context(type)

        extractByPrefix(prefix, type) {
            prefix    = ((Array.isArray(prefix)) ? prefix : [prefix]);
            let
                item,
                array = [],
                result
            ;
            prefix.map((p) => {
                item = this.#namespace.get(p);
                if (item)
                    array.push([p, item]);
            });

            switch (type) {
                case "text/turtle":
                case "turtle":
                    result = "";
                    array.map((item) => {
                        result = `${result}@prefix ${item[0]}: <${item[1]}> .\n`;
                    });
                    result = `${result}\n`;
                    break; // turtle
                case "array":
                    // TODO: base, vocab
                    result = [...this.#namespace];
                    if (addBase)
                        result.push([":", addBase]);
                    //if (addVocab)
                    //    result['@vocab'] = addVocab;
                    break; // array
                case "json":
                case "application/json":
                case "ld+json":
                case "application/ld+json":
                default:
                    result = {};
                    array.map((item) => {
                        result[item[0]] = item[1];
                    });
                    break; // default
            } // switch(type)
            return result;
        } // extractByPrefix()

    } // class Namespace

    return Namespace;

};