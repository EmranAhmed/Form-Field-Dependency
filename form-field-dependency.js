'use strict';

(function ($) {

    /**
     * Use on your css file
     *
     [data-gwpdepends].has-dependent-data {
    display : none;
    }

     [data-gwpdepends].has-dependent-data.show {
    display : inherit;
    }

     [data-gwpdepends].has-dependent-data:not(.show) {
    display : none;
    }

     [data-gwpdepends].has-dependent-data.hide {
    display : none;
    }

     *
     * @param options
     * @constructor
     */
    $.fn.FormFieldDependency = function (options) {

        /**
         * Plugin Settings
         * @type {void|*}
         */
        var settings = $.extend({
            'attribute' : 'depends', // data-depends="[...]"
            'rules'     : {}
        }, options)

        /**
         * Check array exists on array
         * @param needleArray
         * @param haystackArray
         * @param strict
         * @returns {boolean}
         */
        var arrayInArraysHelper = function (needleArray, haystackArray, strict) {

            if (typeof strict == 'undefined') {
                strict = false
            }

            if (needleArray == null) {
                needleArray = []
            }

            if (strict === true) {
                return (needleArray.sort().join(',').toLowerCase() === haystackArray.sort().join(',').toLowerCase())
            }
            else {
                for (var i = 0; i < needleArray.length; i++) {
                    if (haystackArray.indexOf(needleArray[i]) >= 0) {
                        return true
                    }
                }
                return false
            }
        }

        /**
         * Check string exist on array value
         * @param needleString
         * @param haystackArray
         * @returns {boolean}
         */
        var stringInArraysHelper = function (needleString, haystackArray) {
            return ($.inArray(needleString, haystackArray) >= 0) && $.isArray(haystackArray)
        }

        var show = function (element) {
            $(element).removeClass('hide').addClass('show')
        }

        var hide = function (element) {
            $(element).removeClass('show').addClass('hide')
        }

        /**
         * Check value is empty or not
         * @param value
         * @returns {boolean}
         */

        var isEmpty = function (value) {

            if (typeof value == 'null' || typeof value == 'undefined') {
                return true
            }

            if (typeof value == 'string') {
                return value.trim() == ''
            }

            if (typeof value == 'object') {
                if ($.isArray(value)) {
                    var _tmp = $.map(value, function (val, i) {
                        return (val.trim() == '') ? null : val
                    })
                    return $.isEmptyObject(_tmp)
                }
                else {
                    return $.isEmptyObject(value)
                }
            }
        }

        /**
         * For Regular Expression Dependency
         * @param element
         * @param depObject
         * @param parent
         * @param useEvent
         */
        var typeRegExpDependency = function (element, depObject, parent, useEvent) {

            if (typeof useEvent == 'undefined') {
                useEvent = false
            }

            if (typeof $(parent).prop('tagName') == 'undefined') {
                return false
            }

            var tag   = $(parent).prop('tagName').toLowerCase()
            var type  = $(parent).prop('type').toLowerCase()
            var name  = tag + ':' + type
            var value = $(parent).val().trim()

            switch (name) {
                case 'input:text':
                case 'input:password':
                case 'input:number':
                case 'input:date':
                case 'input:email':
                case 'input:url':
                case 'input:tel':
                case 'textarea:textarea':

                    var modifier = (typeof depObject.modifier == 'undefined') ? '' : depObject.modifier
                    var pattern  = new RegExp(depObject.pattern, modifier)

                    if (pattern.test(value)) {
                        show(element)
                        // $(element).addClass('show')
                    }
                    else {
                        hide(element)
                        //$(element).removeClass('show')
                    }
                    break
            }

            if (useEvent) {
                $(document.body).on('input', $(parent), function (e) {
                    typeRegExpDependency(element, depObject, parent, false)
                })
            }
        }

        /**
         * For Empty TextBox
         * @param element
         * @param depObject
         * @param parent
         * @param useEvent
         */
        var typeEmptyDependency = function (element, depObject, parent, useEvent) {

            if (typeof useEvent == 'undefined') {
                useEvent = false
            }

            if (typeof $(parent).prop('tagName') == 'undefined') {
                return false
            }

            var tag   = $(parent).prop('tagName').toLowerCase()
            var type  = $(parent).prop('type').toLowerCase()
            var name  = tag + ':' + type
            var value = $(parent).val()

            switch (name) {
                case 'input:text':
                case 'input:password':
                case 'input:number':
                case 'input:date':
                case 'input:email':
                case 'input:url':
                case 'input:tel':
                case 'textarea:textarea':
                case 'select:select-one':

                    if (value.trim() === '') {
                        // $(element).show()
                        show(element)
                    }
                    else {
                        // $(element).hide()
                        hide(element)
                    }
                    break

                case 'input:checkbox':
                    if ($(parent).is(':checked') && value.trim() !== '') {
                        // $(element).hide()
                        hide(element)
                    }
                    else {
                        // $(element).show()
                        show(element)
                    }
                    break

                case 'select:select-multiple':

                    if (isEmpty(value)) {
                        // $(element).show()
                        show(element)
                    }
                    else {
                        hide(element)
                        // $(element).hide()
                    }

                    break
            }

            if (useEvent) {
                $(document.body).on('input change', $(parent), function (e) {
                    typeEmptyDependency(element, depObject, parent, false)
                })
            }
        }

        /**
         * For non empty TextBox
         * @param element
         * @param depObject
         * @param parent
         * @param useEvent
         */
        var typeNotEmptyDependency = function (element, depObject, parent, useEvent) {

            if (typeof useEvent == 'undefined') {
                useEvent = false
            }

            if (typeof $(parent).prop('tagName') == 'undefined') {
                return false
            }

            var tag   = $(parent).prop('tagName').toLowerCase()
            var type  = $(parent).prop('type').toLowerCase()
            var name  = tag + ':' + type
            var value = $(parent).val()

            switch (name) {
                case 'input:text':
                case 'input:password':
                case 'input:number':
                case 'input:date':
                case 'input:email':
                case 'input:url':
                case 'input:tel':
                case 'textarea:textarea':
                case 'select:select-one':

                    if (value.trim() !== '') {
                        show(element)
                        //$(element).show()
                    }
                    else {
                        hide(element)
                        //$(element).hide()
                    }
                    break

                case 'input:checkbox':
                    if ($(parent).is(':checked') && value.trim() !== '') {
                        // $(element).show()
                        show(element)
                    }
                    else {
                        hide(element)
                        // $(element).hide()
                    }
                    break

                case 'select:select-multiple':

                    if (isEmpty(value)) {
                        hide(element)
                        // $(element).hide()
                    }
                    else {
                        show(element)
                        //$(element).show()
                    }

                    break
            }

            if (useEvent) {
                $(document.body).on('input change', $(parent), function (e) {
                    typeNotEmptyDependency(element, depObject, parent, false)
                })
            }
        }

        /**
         * TextBox value matched with value or with array values
         * @param element
         * @param depObject
         * @param parent
         * @param useEvent
         */
        var typeEqualDependency = function (element, depObject, parent, useEvent) {

            if (typeof useEvent == 'undefined') {
                useEvent = false
            }

            if (typeof $(parent).prop('tagName') == 'undefined') {
                return false
            }

            var tag   = $(parent).prop('tagName').toLowerCase()
            var type  = $(parent).prop('type').toLowerCase()
            var name  = tag + ':' + type
            var value = $(parent).val()

            var equalLike = (typeof depObject.like !== 'undefined');

            // show if empty?. default false
            depObject.empty = (typeof depObject.empty == 'undefined') ? false : depObject.empty

            depObject.strict = (typeof depObject.strict == 'undefined') ? false : depObject.strict

            if (equalLike) {

                var eqtag  = $(depObject.like).prop('tagName').toLowerCase()
                var eqtype = $(depObject.like).prop('type').toLowerCase()
                var eqname = eqtag + ':' + eqtype

                if (eqname === 'input:checkbox' || eqname === 'input:radio') {
                    depObject.value = $(depObject.like + ':checked').map(function () {
                        return this.value
                    }).get()
                }
                else {

                    depObject.value = $(depObject.like).val()

                    if (!showOnEmptyValue) {
                        depObject.value = ($(depObject.like).val().trim() === '') ? null : $(depObject.like).val()
                    }
                }
            }

            switch (name) {
                case 'input:text':
                case 'input:password':
                case 'input:number':
                case 'input:date':
                case 'input:email':
                case 'input:url':
                case 'input:tel':
                case 'textarea:textarea':
                case 'select:select-one':

                    if (value.trim() === depObject.value) {
                        //$(element).show()
                        show(element)
                    }
                    else if (stringInArraysHelper(value, depObject.value)) {
                        //$(element).show()
                        show(element)
                    }
                    else {
                        if (value.trim() === '' && depObject.empty) {
                            // $(element).show()
                            show(element)
                        }
                        else {
                            // $(element).hide()
                            hide(element)
                        }
                    }
                    break

                case 'input:checkbox':
                case 'input:radio':

                    var value = $(parent + ':checked').map(function () {
                        return this.value
                    }).get()

                    if (value === depObject.value) {
                        // $(element).show()
                        show(element)
                    }
                    else if (stringInArraysHelper(value, depObject.value)) {
                        // $(element).show()
                        show(element)
                    }
                    else if (arrayInArraysHelper(value, depObject.value, depObject.strict)) {
                        // $(element).show()
                        show(element)
                    }
                    else {
                        if (isEmpty(value) && depObject.empty) {
                            // $(element).show()
                            show(element)
                        }
                        else {
                            // $(element).hide()
                            hide(element)
                        }
                    }
                    break

                case 'select:select-multiple':

                    if (arrayInArraysHelper(value, depObject.value, depObject.strict)) {
                        //$(element).show()
                        show(element)
                    }
                    else {

                        if (value == null && depObject.empty) {
                            //$(element).show()
                            show(element)
                        }
                        else {
                            hide(element)
                            //$(element).hide()
                        }
                    }
                    break
            }

            if (useEvent) {
                $(document.body).on('input change', $(parent), function (e) {
                    typeEqualDependency(element, depObject, parent, false)
                })
            }

        }

        /**
         * TextBox value not equal with value or with array values
         * @param element
         * @param depObject
         * @param parent
         * @param useEvent
         */
        var typeNotEqualDependency = function (element, depObject, parent, useEvent) {

            if (typeof useEvent == 'undefined') {
                useEvent = false
            }

            if (typeof $(parent).prop('tagName') == 'undefined') {
                return false
            }

            var tag   = $(parent).prop('tagName').toLowerCase()
            var type  = $(parent).prop('type').toLowerCase()
            var name  = tag + ':' + type
            var value = $(parent).val()

            var equalLike    = (typeof depObject.like !== 'undefined')
            depObject.strict = (typeof depObject.strict == 'undefined') ? false : depObject.strict

            // show if empty? default is true
            depObject.empty = (typeof depObject.empty == 'undefined') ? true : depObject.empty

            if (equalLike) {

                var eqtag  = $(depObject.like).prop('tagName').toLowerCase()
                var eqtype = $(depObject.like).prop('type').toLowerCase()
                var eqname = eqtag + ':' + eqtype

                if (eqname === 'input:checkbox' || eqname === 'input:radio') {
                    depObject.value = $(depObject.like + ':checked').map(function () {
                        return this.value
                    }).get()
                }
                else {

                    depObject.value = $(depObject.like).val()

                    if (!showOnEmptyValue) {
                        depObject.value = ($(depObject.like).val().trim() === '') ? null : $(depObject.like).val()
                    }
                }
            }

            switch (name) {
                case 'input:text':
                case 'input:password':
                case 'input:number':
                case 'input:date':
                case 'input:email':
                case 'input:url':
                case 'input:tel':
                case 'textarea:textarea':
                case 'select:select-one':

                    if (value === depObject.value) {
                        // $(element).hide()
                        hide(element)
                    }
                    else if (stringInArraysHelper(value, depObject.value)) {
                        // $(element).hide()
                        hide(element)
                    }
                    else {
                        if (value.trim() === '' && !depObject.empty) {
                            //$(element).hide()
                            hide(element)
                        }
                        else {
                            show(element)
                            //$(element).show()
                        }
                    }
                    break

                case 'input:checkbox':
                case 'input:radio':

                    value = $(parent + ':checked').map(function () {
                        return this.value
                    }).get()

                    if (typeof depObject.strict == 'undefined') {
                        depObject.strict = false
                    }

                    if (value === depObject.value) {
                        hide(element)
                        // $(element).hide()
                    }
                    else if (stringInArraysHelper(value, depObject.value)) {

                        hide(element)
                        // $(element).hide()
                    }
                    else if (arrayInArraysHelper(value, depObject.value, depObject.strict)) {

                        hide(element)
                        // $(element).hide()
                    }
                    else {
                        if (isEmpty(value) && !depObject.empty) {
                            // $(element).hide()
                            hide(element)
                        }
                        else {
                            show(element)
                            // $(element).show()
                        }
                    }

                    break

                case 'select:select-multiple':

                    if (arrayInArraysHelper(value, depObject.value, depObject.strict)) {
                        // $(element).hide()
                        hide(element)
                    }
                    else {
                        if (value == null && !depObject.empty) {
                            // $(element).hide()
                            hide(element)
                        }
                        else {
                            show(element)
                            // $(element).show()
                        }
                    }

                    break
            }

            if (useEvent) {
                $(document.body).on('input change', $(parent), function (e) {
                    typeNotEqualDependency(element, depObject, parent, false)
                })
            }
        }

        /**
         * TextBox value compare
         * @param element
         * @param depObject
         * @param parent
         * @param useEvent
         */
        var typeCompareDependency = function (element, depObject, parent, useEvent) {

            if (typeof useEvent == 'undefined') {
                useEvent = false
            }

            if (typeof $(parent).prop('tagName') == 'undefined') {
                return false
            }

            var tag         = $(parent).prop('tagName').toLowerCase()
            var type        = $(parent).prop('type').toLowerCase()
            var name        = tag + ':' + type
            var value       = parseInt($(parent).val())
            depObject.value = parseInt(depObject.value)

            switch (depObject.sign) {
                case '<':
                case 'lt':
                case 'lessthen':
                case 'less-then':
                case 'LessThen':
                    if (value < depObject.value) {
                        show(element)
                        // hide(element)
                        // $(element).show()
                    }
                    else {
                        hide(element)
                        // $(element).hide()
                    }
                    break

                case '<=':
                case 'lteq':
                case 'lessthenequal':
                case 'less-then-equal':
                case 'LessThenEqual':
                case 'eqlt':
                    if (value <= depObject.value) {
                        show(element)
                        // $(element).show()
                    }
                    else {
                        hide(element)
                        // $(element).hide()
                    }
                    break

                case '>=':
                case 'gteq':
                case 'greaterthenequal':
                case 'greater-then-equal':
                case 'GreaterThenEqual':
                case 'eqgt':
                    if (value >= depObject.value) {
                        // $(element).show()
                        show(element)
                    }
                    else {
                        hide(element)
                        // $(element).hide()
                    }
                    break

                case '>':
                case 'gt':
                case 'greaterthen':
                case 'greater-then':
                case 'GreaterThen':
                    if (value > depObject.value) {
                        // $(element).show()
                        show(element)
                    }
                    else {
                        // $(element).hide()
                        hide(element)
                    }
                    break

            }

            if (useEvent) {
                $(document.body).on('input change', $(parent), function (e) {
                    typeCompareDependency(element, depObject, parent, false)
                })
            }
        }

        /**
         * TextBox value range
         * @param element
         * @param depObject
         * @param parent
         * @param useEvent
         */
        var typeRangeDependency = function (element, depObject, parent, useEvent) {

            if (typeof useEvent == 'undefined') {
                useEvent = false
            }

            if (typeof $(parent).prop('tagName') == 'undefined') {
                return false
            }

            var tag   = $(parent).prop('tagName').toLowerCase()
            var type  = $(parent).prop('type').toLowerCase()
            var name  = tag + ':' + type
            var value = parseInt($(parent).val())
            var min, max

            // value = [50, 100]

            if ($.isArray(depObject.value)) {
                min = parseInt(depObject.value[0])
                max = parseInt(depObject.value[1])
            }

            if (typeof depObject.value == 'undefined') {
                min = parseInt(depObject.min)
                max = parseInt(depObject.max)
            }

            if (min < value && value < max) {
                // $(element).show()
                show(element)
            }
            else {
                // $(element).hide()
                hide(element)
            }

            if (useEvent) {
                $(document.body).on('input change', $(parent), function (e) {
                    typeRangeDependency(element, depObject, parent, false)
                })
            }
        }

        /**
         * TextBox value length
         * @param element
         * @param depObject
         * @param parent
         * @param useEvent
         */
        var typeLengthDependency = function (element, depObject, parent, useEvent) {

            if (typeof useEvent == 'undefined') {
                useEvent = false
            }

            if (typeof $(parent).prop('tagName') == 'undefined') {
                return false
            }

            var tag         = $(parent).prop('tagName').toLowerCase()
            var type        = $(parent).prop('type').toLowerCase()
            var name        = tag + ':' + type
            var value       = $(parent).val().length
            depObject.value = parseInt(depObject.value)

            switch (depObject.sign) {
                case '<':
                case 'lt':
                case 'lessthen':
                case 'less-then':
                case 'LessThen':
                    if (value < depObject.value) {
                        // $(element).show()
                        show(element)
                    }
                    else {
                        // $(element).hide()
                        hide(element)
                    }
                    break

                case '<=':
                case 'lteq':
                case 'lessthenequal':
                case 'less-then-equal':
                case 'LessThenEqual':
                case 'eqlt':
                    if (value <= depObject.value) {
                        // $(element).show()
                        show(element)
                    }
                    else {
                        // $(element).hide()
                        hide(element)
                    }
                    break

                case '>=':
                case 'gteq':
                case 'greaterthenequal':
                case 'greater-then-equal':
                case 'GreaterThenEqual':
                case 'eqgt':
                    if (value >= depObject.value) {
                        // $(element).show()
                        show(element)
                    }
                    else {
                        // $(element).hide()
                        hide(element)
                    }
                    break

                case '>':
                case 'gt':
                case 'greaterthen':
                case 'greater-then':
                case 'GreaterThen':
                    if (value > depObject.value) {
                        // $(element).show()
                        show(element)
                    }
                    else {
                        // $(element).hide()
                        hide(element)
                    }
                    break

            }

            if (useEvent) {
                $(document.body).on('input change', $(parent), function (e) {
                    //e.stopPropagation();
                    //e.stopImmediatePropagation();
                    typeLengthDependency(element, depObject, parent, false)
                })
            }
        }

        /**
         * Using Types
         * @param $el
         * @param $data
         */
        var useTypes = function ($el, $data) {
            $.each($data, function (selector, depObject) {

                switch (depObject.type) {
                    case 'empty':
                        typeEmptyDependency($el, depObject, selector, true)
                        break

                    case 'notempty':
                    case 'not-empty':
                    case 'notEmpty':
                    case '!empty':
                        typeNotEmptyDependency($el, depObject, selector, true)
                        break

                    case 'equal':
                    case '==':
                    case '=':
                        typeEqualDependency($el, depObject, selector, true)
                        break

                    case '!equal':
                    case 'notequal':
                    case '!=':
                    case 'not-equal':
                    case 'notEqual':
                        typeNotEqualDependency($el, depObject, selector, true)
                        break

                    case 'regexp':
                    case 'expression':
                    case 'reg':
                    case 'exp':
                        typeRegExpDependency($el, depObject, selector, true)
                        break

                    case 'compare':
                    case 'comp':
                        typeCompareDependency($el, depObject, selector, true)
                        break

                    case 'length':
                    case 'lng':
                        typeLengthDependency($el, depObject, selector, true)
                        break

                    case 'range':
                        typeRangeDependency($el, depObject, selector, true)
                        break

                }
            })
        };

        (function ($data) {
            $.each($data, function ($el, depObject) {
                useTypes($($el), depObject)
            })
        })(settings.rules)

        return this.each(function () {
            // var $data = $(this).data('depends');
            var $data = $(this).data(settings.attribute.replace('data-', '').trim())

            if ($data) {

                $(this).addClass('has-dependent-data')

                $.each($data, function (el, obj) {
                    useTypes($(this), obj)
                }.bind(this))
            }
        })
    }

})(jQuery);
