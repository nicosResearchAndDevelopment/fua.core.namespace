let
    context   = {
        "dct":       "http://purl.org/dc/terms/",
        "foaf":      "http://xmlns.com/foaf/0.1/",
        "ids":       "https://w3id.org/idsa/core/",
        "idsa":      "https://www.internationaldataspaces.org/the-association/",
        // REM ids association model
        "idsam":     "https://www.internationaldataspaces.org/the-association/model#",
        "idsm":      "https://w3id.org/idsa/metamodel/",
        // REM ids Eco System
        "idsec":     "https://ecosystem.internationaldataspaces.org/",
        // REM ids Eco System Model for Criteria Catalog
        "idsecm-cc": "https://www.internationaldataspaces.org/IDS-IM/ecosystem/certificationcriteria#",
        "org":       "http://www.w3.org/ns/org#",
        "owl":       "http://www.w3.org/2002/07/owl#",
        "rdf":       "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdfs":      "http://www.w3.org/2000/01/rdf-schema#",
        "vann":      "http://purl.org/vocab/vann/",
        "xsd":       "http://www.w3.org/2001/XMLSchema#"
    },
    result
;
const
    Namespace = require(`../src/core.namespace.BETA.js`)(),
    namespace = new Namespace({'namespace': context})
;

result = namespace['context']("turtle", "https://www.example.com/");
result = namespace['context']("array", "https://www.example.com/");
result = namespace['context']("ld+json", "https://www.example.com/");

namespace.add(context);

namespace.add([["xsd", "http://www.w3.org/2001/XMLSchema#"]]);

//region extracting
result = namespace['extractByPrefix']("xsd", "turtle");
result = namespace['extractByPrefix']("xsd", "ld+josn");
//endregion extracting

//region bads
//namespace.add({"xsd":       "http://www.w3.org/2001/XMLSchema_BAD#"});
namespace.add({"xsd_BAD": "http://www.w3.org/2001/XMLSchema#"});
//endregion bads

result = namespace['context']("ld+json", "https://www.example.com/");
console.log(JSON.stringify(result, "", "\t"));

throw namspace;