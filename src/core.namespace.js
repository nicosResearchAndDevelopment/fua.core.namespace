module.exports = ({
                      'self':   self,
                      'root':   root,
                      'config': config
                  }) => {

    let
        namespace = {

        },
        context   = {
            //TODO: hmmmm........... '@id': `${root}${self}/data/context.json`
            '@id': `${root}${self}/data/context.json`
        }
    ;

    namespace['fua'] = {'prefix': config['fua']['prefix'], 'uri': config['fua']['uri'], 'vocab': "#", 'alias': "0"};
    namespace[self]  = {'prefix': self, 'uri': root, 'vocab': "/", 'alias': "1"};

    Object.keys(namespace).forEach((key) => {
        namespace[namespace[key]['uri']] = namespace[key];
        Object.seal(namespace[namespace[key]['uri']]);
        Object.seal(namespace[key]);
    });

    namespace['0'] = {
        'prefix': "0",
        'uri':    namespace['fua']['uri'],
        'vocab':  namespace['fua']['vocab'],
        'alias':  "fua"
    };
    namespace['1'] = {
        'prefix': "1",
        'uri':    namespace[self]['uri'],
        'vocab':  namespace[self]['vocab'],
        'alias':  self
    };

    Object.keys(config).forEach((key) => {
        namespace[key] = config[key];
        Object.seal(namespace[key]);
        namespace[config[key]['uri']] = config[key];
        Object.seal(namespace[config[key]['uri']]);

        context[key] = config[key]['uri'];
        Object.seal(context[key]);

    });

    context['fua'] = namespace['fua']['uri'];
    Object.seal(context['fua']);
    context[self] = namespace[self]['uri'];
    Object.seal(context[self]);
    context[""] = namespace[self]['uri'];
    Object.seal(context[""]);

    Object.defineProperties(namespace, {
        '@context': {value: context},
        '@id':      {value: "fua:namespace"},
        '@type':    {value: "rdfs:Resource"}
    });

    Object.seal(namespace);

    return namespace;

}; // module.exports :: core.namespace


