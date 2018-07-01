'use strict';

import jsonSchema from './schema/root.schema.json';

$(function () {
    const jsonSchemaOld = {
        "$schema": "http://json-schema.org/draft-07/schema#",

        "definitions": {
            "literal": {
                "properties": {
                    "type": {},
                    "raw": { "type": "string" }
                },
                "required": ["raw"]
            },
            "identifier": {
                "properties": {
                    "type": {},
                    "name": { "type": "string" }
                },
                "required": ["name"]
            }
        },

        "type": "object",
        "oneOf": [
            {
                "allOf": [
                    {
                        "properties": {
                            "type": {
                                "enum": ["Literal"]
                            }
                        }
                    },
                    { "$ref": "#/definitions/literal" }
                ]
            },
            {
                "allOf": [
                    {
                        "properties": {
                            "type": {
                                "enum": ["Identifier"]
                            }
                        }
                    },
                    { "$ref": "#/definitions/identifier" }
                ]
            }
        ],
        "required": ["type"]
    };


    function parseContent(content, parse) {
        const valid = tv4.validate(JSON.parse(content.toString()), jsonSchema);
        if (valid) {
            try {
                if (parse)
                    return jsep(content);
                else
                    return unjsep(JSON.parse(content));
            }
            catch (e) {
                console.log(e);
                return e.toString();
            }
        }
        const error = tv4.error;
        console.log(error);
        return JSON.stringify(error, null, 4);
    }

    $("#unjsep").on("click", function () {
        const content = $("#content").val();
        printContent(parseContent(content, false));
    });

    $("#jsep").on("click", function () {
        const content = $("#content").val();
        printContent(parseContent(content, true));
    });

    function printContent(content) {
        content = JSON.stringify(content);
        $("#result").val(content);
    }

});
