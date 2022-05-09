;(function ($) {

})(jQuery)

jQuery(function ($) {
    $("[data-dependency]").each(function () {
        $(this).dependsOn()
    });

})