(function ($) {

    $.fn.formFieldDependency = function (options) {


        var settings = $.extend({}, options);


        var arrayInArraysHelper = function (needles, haystack, strict) {

            if (typeof strict == 'undefined') {
                strict = false;
            }

            if (strict == true) {
                if( (needles.sort().join(',').toLowerCase()) == (haystack.sort().join(',').toLowerCase())) {
                    return true;
                }
                return false;
            } else {
                for (i = 0; i < needles.length; i++) {
                    if (haystack.indexOf(needles[i]) > -1) {
                        return true;
                    }
                }
                return false;
            }
        };

        var stringInArraysHelper = function (needles, haystack) {


            if ($.inArray(needles, haystack) >= 0) {
                return true;
            }
            else {
                return false;
            }
        };

        var selectFn = function (element, selector, expected_value) {

            var current_value = $(selector).val();


            // Multi Select
            if (Array.isArray(current_value)) {

                if (arrayInArray(current_value, expected_value)) {
                    element.show();
                }
                else {
                    element.hide();
                }
            }
            else { // Single Select

                if (expected_value.toString().indexOf(current_value) > -1) {
                    element.show();
                }
                else {
                    element.hide();
                }
            }
        };


        /**
         * For TextBox Regular Expression
         * @param element
         * @param depObject
         * @param parent
         * @param useEvent
         */
        var typeRegExpDependency = function (element, depObject, parent, useEvent) {

            if (typeof useEvent == 'undefined') {
                useEvent = false;
            }
            var tag = $(parent).prop("tagName").toLowerCase();
            var type = $(parent).prop("type").toLowerCase();
            var name = tag + ':' + type;
            var value = $.trim($(parent).val());

            switch (name) {
                case "input:text":
                case "input:password":
                case "input:number":
                case "input:date":
                case "input:email":
                case "input:url":
                case "input:tel":
                case "textarea:textarea":

                    var modifier = ( typeof depObject.modifier=='undefined' ) ? '': depObject.modifier;
                    var pattern = new RegExp( depObject.pattern, modifier );

                    if ( pattern.test(value) ) {
                        $(element).show();
                    }
                    else {
                        $(element).hide();
                    }
                    break;
            }

            if (useEvent) {
                $(document.body).on('keyup', $(parent), function (e) {
                    e.stopPropagation();
                    typeRegExpDependency(element, depObject, parent, false);
                });
            }
        };


        /**
         * For empty TextBox
         * @param element
         * @param depObject
         * @param parent
         * @param useEvent
         */
        var typeEmptyDependency = function (element, depObject, parent, useEvent) {

            if (typeof useEvent == 'undefined') {
                useEvent = false;
            }
            var tag = $(parent).prop("tagName").toLowerCase();
            var type = $(parent).prop("type").toLowerCase();
            var name = tag + ':' + type;
            var value = $(parent).val();

            switch (name) {
                case "input:text":
                case "input:password":
                case "input:number":
                case "input:date":
                case "input:email":
                case "input:url":
                case "input:tel":
                case "textarea:textarea":

                    if ($.trim(value) == '') {
                        $(element).show();
                    }
                    else {
                        $(element).hide();
                    }
                    break;

                case "input:checkbox":
                    if ($(parent).is(':checked')) {
                        $(element).hide();
                    }
                    else {
                        $(element).show();
                    }
                    break;
            }

            if (useEvent) {
                $(document.body).on('keyup change', $(parent), function (e) {
                    e.stopPropagation();
                    typeEmptyDependency(element, depObject, parent, false);
                });
            }
        };


        /**
         * For non empty TextBox
         * @param element
         * @param depObject
         * @param parent
         * @param useEvent
         */
        var typeNotEmptyDependency = function (element, depObject, parent, useEvent) {

            if (typeof useEvent == 'undefined') {
                useEvent = false;
            }
            var tag = $(parent).prop("tagName").toLowerCase();
            var type = $(parent).prop("type").toLowerCase();
            var name = tag + ':' + type;
            var value = $(parent).val();

            switch (name) {
                case "input:text":
                case "input:password":
                case "input:number":
                case "input:date":
                case "input:email":
                case "input:url":
                case "input:tel":
                case "textarea:textarea":

                    if ($.trim(value) != '') {
                        $(element).show();
                    }
                    else {
                        $(element).hide();
                    }
                    break;

                case "input:checkbox":
                    if ($(parent).is(':checked')) {
                        $(element).show();
                    }
                    else {
                        $(element).hide();
                    }
            }

            if (useEvent) {
                $(document.body).on('keyup change', $(parent), function (e) {
                    e.stopPropagation();
                    typeNotEmptyDependency(element, depObject, parent, false);
                });
            }
        };


        /**
         * TextBox value matched with value or with array values
         * @param element
         * @param depObject
         * @param parent
         * @param useEvent
         */
        var typeEqualDependency = function (element, depObject, parent, useEvent) {

            if (typeof useEvent == 'undefined') {
                useEvent = false;
            }
            var tag = $(parent).prop("tagName").toLowerCase();
            var type = $(parent).prop("type").toLowerCase();
            var name = tag + ':' + type;
            var value = $(parent).val();

            switch (name) {
                case "input:text":
                case "input:password":
                case "input:number":
                case "input:date":
                case "input:email":
                case "input:url":
                case "input:tel":
                case "textarea:textarea":

                    if (value == depObject.value) {
                        $(element).show();
                    }
                    else if (stringInArraysHelper(value, depObject.value)) {
                        $(element).show();
                    }
                    else {
                        $(element).hide();
                    }

                    break;

                case "input:checkbox":
                case "input:radio":


                    var value = $(parent + ':checked').map(function () {
                        return this.value;
                    }).get();

                    if (typeof depObject.strict == 'undefined') {
                        depObject.strict = false;
                    }


                    if (value == depObject.value) {
                        $(element).show();
                    }
                    else if (stringInArraysHelper(value, depObject.value)) {
                        $(element).show();
                    }
                    else if (arrayInArraysHelper(value, depObject.value, depObject.strict)) {
                        $(element).show();
                    }
                    else {
                        $(element).hide();
                    }

                    break;

            }

            if (useEvent) {
                $(document.body).on('keyup change', $(parent), function (e) {
                    e.stopPropagation();
                    typeEqualDependency(element, depObject, parent, false);
                });
            }

        };


        /**
         * TextBox value not equal with value or with array values
         * @param element
         * @param depObject
         * @param parent
         * @param useEvent
         */
        var typeNotEqualDependency = function (element, depObject, parent, useEvent) {

            if (typeof useEvent == 'undefined') {
                useEvent = false;
            }
            var tag = $(parent).prop("tagName").toLowerCase();
            var type = $(parent).prop("type").toLowerCase();
            var name = tag + ':' + type;
            var value = $(parent).val();

            switch (name) {
                case "input:text":
                case "input:password":
                case "input:number":
                case "input:date":
                case "input:email":
                case "input:url":
                case "input:tel":
                case "textarea:textarea":

                    if (value == depObject.value) {
                        $(element).hide();
                    }
                    else if (stringInArraysHelper(value, depObject.value)) {
                        $(element).hide();
                    }
                    else {
                        $(element).show();
                    }
                    break;


                case "input:checkbox":
                case "input:radio":


                    var value = $(parent + ':checked').map(function () {
                        return this.value;
                    }).get();

                    if (typeof depObject.strict == 'undefined') {
                        depObject.strict = false;
                    }


                    if (value == depObject.value) {
                        $(element).hide();
                    }
                    else if (stringInArraysHelper(value, depObject.value)) {
                        $(element).hide();
                    }
                    else if (arrayInArraysHelper(value, depObject.value, depObject.strict)) {
                        $(element).hide();
                    }
                    else {
                        $(element).show();
                    }

                    break;


            }


            if (useEvent) {
                $(document.body).on('keyup change', $(parent), function (e) {
                    e.stopPropagation();
                    typeNotEqualDependency(element, depObject, parent, false);
                });
            }
        };


        return this.each(function () {

            $el = $(this);
            $data = JSON.parse($(this).data('depends').replace(/'/g, '"'));

            $.each($data, function (selector, depObject) {

                switch (depObject.type) {
                    case "empty":
                        typeEmptyDependency($el, depObject, selector, true);
                        break;

                    case "notempty":
                    case "not-empty":
                    case "notEmpty":
                    case "!empty":
                        typeNotEmptyDependency($el, depObject, selector, true);
                        break;

                    case "equal":
                    case "==":
                    case "=":
                        typeEqualDependency($el, depObject, selector, true);
                        break;

                    case "!equal":
                    case "notequal":
                    case "!=":
                    case "not-equal":
                    case "notEqual":
                        typeNotEqualDependency($el, depObject, selector, true);
                        break;

                    case "regexp":
                    case "expression":
                    case "reg":
                    case "exp":
                        typeRegExpDependency($el, depObject, selector, true);
                        break;


                }
            });
        });
    }
})(jQuery);

jQuery(function ($) {

    $('[data-depends]').formFieldDependency();

});