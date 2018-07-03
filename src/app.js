import $ from "jquery";
import Ajv from 'ajv';

import './assets/scss/app.scss';
import jsonSchema from '../schema/root.schema.json';
console.log("jsonSchema",jsonSchema);
const jsepValidator = new Ajv().compile(jsonSchema);

$(function () {

    function parseContent(content, parse) {
        const valid = jsepValidator.validate(JSON.parse(content.toString()));
        if (valid) {
            try {
                if (parse)
                    return jsep(content);
                else
                    return JSON.parse(content);
            }
            catch (e) {
                console.log(e);
                return e.toString();
            }
        }
        const errors = jsepValidator.errors;
        console.log(errors);
        return JSON.stringify(errors, null, 4);
    }

    $("#validate").on("click", function () {
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
