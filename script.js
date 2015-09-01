jQuery(function ($) {
    $('[data-depends]').formFieldDependency();


    /*$.fn.formFieldDependency({

        'attribute' : 'data-depends',
        'rules'     : {

            '#only-email' : {
                '#InputEmail' : {'type' : 'regexp', 'pattern' : '[a-z]+@[a-z]+.[a-z]', 'modifier' : 'i'}
            },

            '#only-equal' :
            {
                '#InputEmail' : {'type' : 'equal', 'value' : ['lorem', 'ipsum']}
            }

        }

    });*/
});