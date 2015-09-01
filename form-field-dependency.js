(function ($) {

    $.fn.formFieldDependency = function (options) {

        /**
         * Plugin Settings
         * @type {void|*}
         */
        var settings = $.extend({
            'attribute' : 'data-depends',
            'rules'     : {}
        }, options);

        /**
         * Check array exists on array
         * @param needleArray
         * @param haystackArray
         * @param strict
         * @returns {boolean}
         */
        var arrayInArraysHelper = function (needleArray, haystackArray, strict) {

            if (typeof strict == 'undefined') {
                strict = false;
            }

            if (strict == true) {
                if ((needleArray.sort().join(',').toLowerCase()) == (haystackArray.sort().join(',').toLowerCase())) {
                    return true;
                }
                return false;
            }
            else {
                for (i = 0; i < needleArray.length; i++) {
                    if (haystackArray.indexOf(needleArray[i]) >= 0) {
                        return true;
                    }
                }
                return false;
            }
        };

        /**
         * Check string exist on array value
         * @param needleString
         * @param haystackArray
         * @returns {boolean}
         */
        var stringInArraysHelper = function (needleString, haystackArray) {

            if (($.inArray(needleString, haystackArray) >= 0) && isArray(haystackArray) ) {
                return true;
            }
            else {
                return false;
            }
        };

        /**
         * Check value is array or not
         * @param value
         * @returns {boolean}
         */
        var isArray = function(value){
            return value instanceof Array;
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
         * For Regular Expression Dependency
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

                    var modifier = ( typeof depObject.modifier == 'undefined' ) ? '' : depObject.modifier;
                    var pattern = new RegExp(depObject.pattern, modifier);

                    if (pattern.test(value)) {
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
         * For Empty TextBox
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

            var equalLike = (typeof depObject.like=='undefined') ? false : true;

            if( equalLike ){

                // Allow when both have empty value
                var showOnEmptyValue = (typeof depObject.empty=='undefined') ? false : depObject.empty;

                var eqtag = $(depObject.like).prop("tagName").toLowerCase();
                var eqtype = $(depObject.like).prop("type").toLowerCase();
                var eqname = eqtag + ':' + eqtype;

                if( eqname=='input:checkbox' || eqname=='input:radio' ){
                    depObject.value = $(depObject.like + ':checked').map(function () {
                        return this.value;
                    }).get();
                }else{

                    depObject.value = $(depObject.like).val();

                    if( !showOnEmptyValue ){
                        depObject.value = ($.trim($(depObject.like).val())=='') ? null : $(depObject.like).val() ;
                    }
                }

            }



            switch (name) {
                case "input:text":
                case "input:password":
                case "input:number":
                case "input:date":
                case "input:email":
                case "input:url":
                case "input:tel":
                case "textarea:textarea":

                    if ($.trim(value) == depObject.value) {
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

            var equalLike = (typeof depObject.like=='undefined') ? false : true;

            if( equalLike ){

                // Allow when both have empty value
                var showOnEmptyValue = (typeof depObject.empty=='undefined') ? false : depObject.empty;

                var eqtag = $(depObject.like).prop("tagName").toLowerCase();
                var eqtype = $(depObject.like).prop("type").toLowerCase();
                var eqname = eqtag + ':' + eqtype;

                if( eqname=='input:checkbox' || eqname=='input:radio' ){
                    depObject.value = $(depObject.like + ':checked').map(function () {
                        return this.value;
                    }).get();
                }else{

                    depObject.value = $(depObject.like).val();

                    if( !showOnEmptyValue ){
                        depObject.value = ($.trim($(depObject.like).val())=='') ? null : $(depObject.like).val() ;
                    }
                }

            }

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

        /**
         * Using Types
         * @param $el
         * @param $data
         */
        var useTypes = function($el, $data){
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
        };

        (function($data){
            $.each($data, function ($el, depObject) {
                useTypes($($el), depObject);
            });
        })(settings.rules);

        return this.each(function () {
            $data = JSON.parse($(this).attr(settings.attribute).replace(/'/g, '"'));
            useTypes($(this), $data);
        });
    }
})(jQuery);