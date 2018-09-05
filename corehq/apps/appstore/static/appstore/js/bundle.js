define("appstore/js/facet_sidebar", ['jquery'], function($) {
    var escapeRegExp = function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };

    var replaceAll = function(find, replace, str) {
        // http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript#answer-1144788
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    };

    var chevron_toggle = function(show, $toggling, $chevron, $holds_toggle_state, after_fn) {
        var chev = "fa-double-angle-";
        if (show) {
            $toggling.hide();
            $chevron
                .removeClass(chev + "down")
                .addClass(chev + "right")
            $holds_toggle_state.data("show", false);
        } else {
            $toggling.show();
            $toggling.removeClass('hide');
            $chevron
                .removeClass(chev + "right")
                .addClass(chev + "down")
            $holds_toggle_state.data("show", true);
        }
        if (after_fn) {
            after_fn();
        }
    };

    $(function () {
        $(".more-sortable-button").click(function() {
            var $this = $(this);
            var sortable = $this.data('sortable').replace(new RegExp("\\.", "g"), "\\.");
            $('.sortable-' + sortable).removeClass('hide');
            $this.hide();
            return false;
        });

        $(".facet-group-btn").click(function(){
            var $this = $(this);
            var group_name = $this.data('name');
            var $facet_group = $(".facet-group[data-group-name='" + group_name + "']");

            chevron_toggle($facet_group.data('show'), $facet_group, $this.children('.facet-group-chevron'), $facet_group);
            return false;
        });

        $(".facet-btn").click(function(){
            var $this = $(this);
            var sortable = replaceAll(".", "\\.", $this.data('sortable'));

            var fn = function() {
                $(".more-sortable-button[data-sortable='" + sortable + "']").hide();
            };

            chevron_toggle($this.data('show'), $(".sortable-" + sortable), $this.find('.facet-chevron'), $this, fn);
            return false;
        });

        var $update_btn = $("#update-facets");
        var $facet_search_form = $("#facet-search");
        var $facet_search_bar = $facet_search_form.find('input');
        $update_btn.click(function() {
            var $this = $(this);
            var url = "?";
            if ($this.data('params')) {
                url += $(this).data('params') + "&";
            }
            var prefix = "";
            if ($this.data('prefix')) {
                prefix += $(this).data('prefix');
            }

            $(".sortable").each(function(){
                var sortable_name = $(this).data("name");
                $(this).find('.facet-checkbox').each(function(){
                    var $facet = $(this);
                    if ($facet.is(":checked") && $facet.attr("name")) {
                        url += prefix + sortable_name + "=" + $facet.attr("name") + "&";
                    }
                });
            });

            if ($facet_search_bar.val()) {
                var name = $facet_search_bar.attr("name") || "search";
                url += name + "=" + $facet_search_bar.val();
            }
            window.location = encodeURI(url);
        });

        $facet_search_form.submit(function(e) {
            e.preventDefault();
            $update_btn.click();
        });
    });
});

define('appstore/js/appstore_base', [
    'jquery',
    'appstore/js/facet_sidebar',
], function (
    $
) {
    // This assures that all the result elements are the same height
    function assure_correct_spacing() {
        $('.results').each(function(){
            var highest = 0;
            var $wells = $(this).find('.well');
            $wells.each(function(){
                var height = $(this).children(":first").height();
                highest = (height > highest) ? height : highest;
            });
            $wells.height(highest);
        });
    }
    $(window).on('load', assure_correct_spacing);
    if (document.readyState === "complete") {
        assure_correct_spacing();
    }
    $(window).resize(assure_correct_spacing);
});

define('appstore/js/project_info', [
    'jquery',
    'hqwebapp/js/initial_page_data',
    'analytix/js/google',
], function (
    $,
    initialPageData,
    googleAnalytics
) {
    function update_import_into_button() {
        var project = $('#project_select option:selected').text();
        $("#import-into-button").text("Import into " + project);
    }

    $(function(){
        update_import_into_button();

        $("#import-app-button").click(function() {
            $('#import-app').removeClass('hide');
        });

        $('#project_select').change(update_import_into_button);

        $('[data-target="#licenseAgreement"]').click(function() {
            var new_form = $(this).attr('data-form');
            $('#agree-button').attr('data-form', new_form);
        });
        $('#agree-button').click(function() {
            $('#agree-button').unbind()
                .addClass('disabled');
            $('#download-new-project').removeProp('data-toggle');
            $('#download-new-project').removeProp('href');
            $('#import-into-button').removeProp('data-toggle');
            $('#import-into-button').removeProp('href');
            var form = $("#" + $(this).attr('data-form'));
            form.submit();
        });

        // Analytics
        var project = initialPageData.get('project');
        $('#download-new-project').click(function() {
            googleAnalytics.track.event('Exchange', 'Download As New Project', project);
        });

        $('#import-app-button').click(function() {
            googleAnalytics.track.event('Exchange', 'Download to Existing Project', project);
        });
    });
});


define("appstore/js/bundle", function(){});

//# sourceMappingURL=bundle.js.map