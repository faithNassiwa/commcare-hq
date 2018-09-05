/*
 *  Manage data needed by JavaScript but supplied by server,
 *  with special handling for urls.
 *
 *  In django templates, use {% initial_page_data varName varValue %} to
 *  define data, then in JavaScript use this module's get function to
 *  access it.
 */
define('hqwebapp/js/initial_page_data', ['jquery', 'underscore'], function ($, _) {
    var data_selector = ".initial-page-data",
        _initData = {},
        url_selector = ".commcarehq-urls",
        urls = {};

    /*
     *  Find any unregistered data. Error on any duplicates.
     */
    var gather = function(selector, existing) {
        /*if (document.readyState !== "complete") {
            console.assert(false, "Attempt to call initial_page_data.gather before document is ready"); // eslint-disable-line no-console
            $.get('/assert/initial_page_data/');
        }*/

        existing = existing || {};
        $(selector).each(function() {
            _.each($(this).children(), function(div) {
                var $div = $(div),
                    data = $div.data();
                if (existing[data.name] !== undefined) {
                    throw new Error("Duplicate key in initial page data: " + data.name);
                }
                existing[data.name] = data.value;
                $div.remove();
            });
        });
        return existing;
    };

    /*
     * Fetch a named value.
     */
    var get = function(name) {
        if (_initData[name] === undefined) {
            _initData = gather(data_selector, _initData);
        }
        return _initData[name];
    };

    /*
     * Analogous to {% initial_page_data name value %}, but accessible from JS
     * Useful for mocha tests
     */
    var register = function (name, value) {
        if (_initData[name] !== undefined) {
            throw new Error("Duplicate key in initial page data: " + name);
        }
        _initData[name] = value;
    };

    // http://stackoverflow.com/a/21903119/240553
    var getUrlParameter = function (param) {
        return getUrlParameterFromString(param, window.location.search);
    };

    var getUrlParameterFromString = function (param, search) {
        var pageUrl = search.substring(1),
            urlVariables = pageUrl.split('&');

        for (var i = 0; i < urlVariables.length; i++) {
            var keyValue = urlVariables[i].split('=');
            var key = decodeURIComponent(keyValue[0]);
            var value = decodeURIComponent(keyValue[1]);

            if (key === param) {
                return value === undefined ? true : value;
            }
        }
    };

    /*
     *  Manually add url to registry.
     */
    var registerUrl = function(name, url) {
        urls[name] = url;
    };

    /*
     *  Fetch actual url, based on name.
     */
    var reverse = function (name) {
        var args = arguments;
        var index = 1;
        if (!urls[name]) {
            urls = gather(url_selector, urls);
            if (!urls[name]) {
                throw new Error("URL '" + name + "' not found in registry");
            }
        }
        return urls[name].replace(/---/g, function () {
            return args[index++];
        });
    };

    $(function() {
        _initData = gather(data_selector, _initData);
        urls = gather(url_selector, urls);
    });

    return {
        gather: gather,
        get: get,
        register: register,
        getUrlParameter: getUrlParameter,
        getUrlParameterFromString: getUrlParameterFromString,
        registerUrl: registerUrl,
        reverse: reverse,
    };
});

/**
 *  Fetches all the initialization data needed for the different analytics platforms.
 *  Note that all of this initialization data is undefined until the document is ready.
 */
define('analytix/js/initial', [
    'jquery',
    'underscore',
    'hqwebapp/js/initial_page_data',
], function (
    $,
    _,
    initialPageData
) {
    'use strict';
    var _selector = '.initial-analytics-data',
        _gather =  initialPageData.gather,
        _initData = {},
        _abSelector = '.analytics-ab-tests',
        _abTests,
        _abTestsByApi = {};

    /**
     * Helper function to create the namespaced slug for the initial_analytics_data
     * eg apiName.key
     * @param {string} apiName
     * @param {string} key
     * @returns {string}
     * @private
     */
    var _getSlug = function (apiName, key) {
        return apiName + '.' + key;
    };

    /**
     * Get the namespaced initial_analytics_data value.
     * @param {string} apiName
     * @param {string} key
     * @returns {*} value
     * @private
     */
    var _getNamespacedData = function (apiName, key) {
        var slug = _getSlug(apiName, key);
        if (_initData[slug] === undefined) {
            _initData = _gather(_selector, _initData);
        }
        return _initData[slug];
    };

    /**
     * Returns a get function namespaced to the specified API.
     * @param apiName
     * @returns {Function}
     */
    var getFn = function (apiName) {
        /**
         * Helper function for returning the data
         * @param {string} key
         * @param {*} optDefault - (optional) value returned if the fetched value is undefined or false
         * @param {*} optTrue - (optional) value returned if the fetched value is true
         */
        return function (key, optDefault, optTrue) {
            var data = _getNamespacedData(apiName, key);
            if (optTrue !== undefined) {
                data = data ? optTrue : optDefault;
            } else {
                data = data || optDefault;
            }
            return data;
        };
    };

    /**
     * Fetches all AB Tests for a given API name
     * @param {string} apiName
     * @returns {array} array of abTests
     */
    var getAbTests = function (apiName) {
        if (_.isUndefined(_abTests)) {
            _abTests = _gather(_abSelector, {});
        }
        if (_.isUndefined(_abTestsByApi[apiName])) {
            _abTestsByApi[apiName] = _.compact(_.map(_abTests, function (val, key) {
                if (key.startsWith(apiName)) {
                    return {
                        slug: _.last(key.split('.')),
                        context: val,
                    };
                }
            }));
        }
        return _abTests;
    };

    $(function() {
        _initData = _gather(_selector, _initData);
    });

    return {
        getFn: getFn,
        getAbTests: getAbTests,
    };
});

/* globals JSON */
define('analytix/js/logging', [
    'underscore',
    'analytix/js/initial',
], function (
    _,
    initialAnalytics
) {
    'use strict';

    var _makeLevel = function (name, style) {
        return {
            name: name,
            style: style,
        };
    };

    var _LEVELS = {
        warning: _makeLevel('WARNING', 'color: #994f00;'),
        verbose: _makeLevel('VERBOSE', 'color: #685c53;'),
        debug: _makeLevel('DEBUG', 'color: #004ebc;'),
    };

    var _printPretty = function (message) {
        var _title, _value, _group;
        if (_.isUndefined(message.value)) {
            console.log("Message was undefined");  // eslint-disable-line no-console
        } else if (message.value.isGroup) {
            _group = message.value;
            _group.level = message.level;
            _group.print();
        } else if (_.isArguments(message.value)) {
            _title = "Arguments (" + message.value.length + ")    " + _.map(Array.from(message.value), JSON.stringify).join('    ');
            _value = Array.from(message.value);
            _group = groupModel(_title, messageModel(_value, message.level));
            _group.isCollapsed = true;
            _group.print();
        } else if (_.isArray(message.value)) {
            _.each(message.value, function (msg) {
                _printPretty(messageModel(msg, message.level));
            });
        } else if (_.isObject(message.value) && _.has(message.value, 0) && _.isElement(message.value[0])) {
            // DOM element
            _title = "#" + message.value.get(0).id + " ." + message.value.get(0).className.split(' ').join('.');
            _value = message.value.get(0).outerHTML;
            _group = groupModel(_title, messageModel(_value, message.level));
            _group.isCollapsed = true;
            _group.print();
        } else if (!_.isString(message.value) && !_.isUndefined(message.value)) {
            _title = JSON.stringify(message.value);
            _value = message.value;
            _group = groupModel(_title, messageModel(_value, message.level));
            _group.isCollapsed = true;
            _group.isRaw = true;
            _group.print();
        } else {
            message.print();
        }
    };

    var _getStyle = function (level) {
        var levelOptions = _LEVELS[level];
        return (levelOptions) ? levelOptions.style : "";
    };

    var messageModel = function (value, level) {
        var msg = {};
        msg.level = level;
        msg.value = value;
        msg.print = function () {
            console.log(msg.value);  // eslint-disable-line no-console
        };
        return msg;
    };

    /**
     * Used to format console log messages better by combining them into
     * groups so that it's easier to skim data vs info text on the console output
     * and improve readability.
     */
    var groupModel = function (title, message) {
        var grp = {};
        grp.title = title;
        grp.level = message.level;
        grp.message = message;
        grp.isCollapsed = false;
        grp.isRaw = false;
        grp.isGroup = true;
        grp.print = function () {
            var _printGrp = (grp.isCollapsed) ? console.groupCollapsed : console.group;  // eslint-disable-line no-console
            _printGrp("%c%s", _getStyle(grp.level), grp.title);
            (grp.isRaw) ? grp.message.print() : _printPretty(grp.message);
            console.groupEnd();  // eslint-disable-line no-console
        };
        return grp;
    };

    var logModel = function(level, logger) {
        var _log = {};
        _log.level = level.slug;
        _log.isVisible = level.isVisible;

        /**
         * Helper function for creating the logging prefix.
         * @returns {string}
         * @private
         */
        _log.getPrefix = function (messagePrefix) {
            var prefix = _.compact(_.flatten([level.prefix, logger.prefix, _log.category, messagePrefix]));
            return prefix.join(' | ') + '    ';
        };
        return {
            getPrint: function () {
                return function (messageValue, messagePrefix) {
                    if (_log.isVisible) {
                        var group = groupModel(_log.getPrefix(messagePrefix), messageModel(messageValue, _log.level));
                        group.print();
                    }
                };
            },
            setCategory: function (category) {
                _log.category = category;
            },
        };
    };

    var levels = ['warning', 'debug', 'verbose'];
    var Level = function (_levelSlug, _levelPrefix, _logger) {
        var globalLevel = initialAnalytics.getFn('global')('logLevel'),
            isVisible = levels.indexOf(_levelSlug) <= levels.indexOf(globalLevel),
            _levelData = {
                slug: _levelSlug,
                prefix: _levelPrefix,
                isVisible: isVisible,
            },
            level = {};
        level.addCategory = function (slug, category) {
            if (_.isUndefined(level[slug])) {
                var _log = logModel(_levelData, _logger);
                _log.setCategory(category);
                level[slug] = _log.getPrint();
            }
        };
        level.addCategory('log');
        return level;
    };

    var loggerModel = function (_prefix) {
        var logger = {};
        logger.prefix = _prefix;
        logger.createLevel = function (slug, name) {
            return Level(slug, name, logger);
        };
        _.each(_LEVELS, function (options, key) {
            logger[key] = logger.createLevel(key, options.name);
        });
        logger.fmt = {};
        logger.fmt.groupMsg = function (title, message) {
            return groupModel(title, messageModel(message));
        };
        /**
         * Outputs a list of group messages that maps argument labels to their values.
         * @param {string[]} labels
         * @param {Arguments} args
         */
        logger.fmt.labelArgs = function (labels, args) {
            return _.compact(_.map(labels, function (label, ind) {
                if (args[ind]) {
                    return logger.fmt.groupMsg(label, args[ind]);
                }
            }));
        };
        return logger;
    };

    return {
        getLoggerForApi: function (apiName) {
            return loggerModel(apiName);
        },
    };
});

/* globals JSON */
define('analytix/js/utils', [
    'jquery',
    'underscore',
    'analytix/js/initial',
], function (
    $,
    _,
    initialAnalytics
) {
    'use strict';

    /**
     * A helper function for for tracking google analytics events after a click
     * on an element in the dom.
     *
     * @param {(object|string)} element - A DOM element, jQuery object, or selector.
     * @param {function} trackFunction -
     *      A function that takes a single optional callback.
     *      If called without the callback, this function should
     *      record an event. If called with a callback, this
     *      function should record an event and call the
     *      callback when finished.
     */
    var trackClickHelper = function (element, trackFunction) {
        var eventHandler = function (event) {
            var $this = $(this);
            if (event.metaKey || event.ctrlKey || event.which === 2  // which === 2 for middle click
                || event.currentTarget.target && event.currentTarget !== "_self") {
                // The current page isn't being redirected so just track the click
                // and don't prevent the default click action.
                trackFunction();
            } else {
                // Track how many trackLinkHelper-related handlers
                // this event has, so we only actually click
                // once, after they're all complete.
                var $target = $(event.delegateTarget);
                var count = $target.data("track-link-count") || 0;
                count++;
                $target.data("track-link-count", count);

                event.preventDefault();
                var callbackCalled = false;
                var callback = function () {
                    if (!callbackCalled) {
                        var $target = $(event.delegateTarget);
                        var count = $target.data("track-link-count");
                        count--;
                        $target.data("track-link-count", count);
                        if (!count) {
                            document.location = $this.attr('href');
                        }
                        callbackCalled = true;
                    }
                };
                // callback might not get executed if, say, gtag can't be reached.
                setTimeout(callback, 2000);
                trackFunction(callback);
            }
        };
        if (typeof element === 'string') {
            $(element).on('click', eventHandler);
        } else {
            if (element.nodeType){
                element = $(element);
            }
            element.click(eventHandler);
        }
    };

    var getDateHash = function () {
        var e = 3e5;
        return Math.ceil(new Date() / e) * e;
    };

    /**
     * Makes sure an analytics callback ONCE is called even if the command fails
     * @param {function} callback
     * @param {integer} timeout - (optional)
     * @returns {function} once callback
     */
    var createSafeCallback = function (callback, timeout) {
        var oneTimeCallback = callback;
        if (_.isFunction(callback)){
            oneTimeCallback = _.once(callback);
            setInterval(oneTimeCallback, timeout ? timeout : 2000);
        }
        return oneTimeCallback;
    };

    /**
     * Initialize an API.
     * @param {Deferred} ready The promise to return (see below). Passed as a parameter
     *  so the calling code can attach callbacks to it before calling this function.
     * @param {string} apiId
     * @param {string/array} scriptUrls - Accepts string or array of strings
     * @param {Logger} logger
     * @param {function} initCallback - Logic to run once any scripts are loaded but before
        the promise this function returns is resolved.
     * @returns {Deferred} A promise that will resolve once the API is fully initialized.
     *  This promise will be rejected if the API fails to initialize for any reason, most
     *  likely because analytics is disabled or because a script failed to load.
     */
    var initApi = function(ready, apiId, scriptUrls, logger, initCallback) {
        logger.verbose.log(apiId || "NOT SET", ["DATA", "API ID"]);

        if (_.isString(scriptUrls)) {
            scriptUrls = [scriptUrls];
        }

        if (!initialAnalytics.getFn('global')(('isEnabled'))) {
            logger.debug.log("Failed to initialize because analytics are disabled");
            ready.reject();
            return ready;
        }

        if (!apiId) {
            logger.debug.log("Failed to initialize because apiId was not provided");
            ready.reject();
            return ready;
        }

        $.when.apply($, _.map(scriptUrls, function(url) { return $.getScript(url); }))
            .done(function() {
                if (_.isFunction(initCallback)) {
                    initCallback();
                }
                logger.debug.log('Initialized');
                ready.resolve();
            }).fail(function() {
                logger.debug.log("Failed to Load Script - Check Adblocker");
                ready.reject();
            });

        return ready;
    };

    return {
        trackClickHelper: trackClickHelper,
        createSafeCallback: createSafeCallback,
        getDateHash: getDateHash,
        initApi: initApi,
    };
});

/* globals Array, window */
/**
 *  Handles communication with the google analytics API. gtag is the replacement
 *  for Google's old analytics.js (ga).
 */
define('analytix/js/google', [
    'jquery',
    'underscore',
    'analytix/js/initial',
    'analytix/js/logging',
    'analytix/js/utils',
], function (
    $,
    _,
    initialAnalytics,
    logging,
    utils
) {
    'use strict';
    var _get = initialAnalytics.getFn('google'),
        _logger = logging.getLoggerForApi('Google Analytics'),
        _ready = $.Deferred();

    var _gtag = function () {
        // This should never run, because all calls to _gtag should be
        // inside done handlers for ready, but just in case...
        _logger.warning.log(arguments, 'skipped gtag');
    };

    $(function () {
        var apiId = _get('apiId'),
            scriptUrl = '//www.googletagmanager.com/gtag/js?id=' + apiId;

        _logger = logging.getLoggerForApi('Google Analytics');
        _ready = utils.initApi(_ready, apiId, scriptUrl, _logger, function() {
            window.dataLayer = window.dataLayer || [];
            _gtag = function () {
                window.dataLayer.push(arguments);
                _logger.verbose.log(arguments, 'gtag');
            };
            _gtag('js', new Date());

            var user = {
                user_id: _get('userId', 'none'),
                isDimagi: _get('userIsDimagi', 'no', 'yes'),
                isCommCare: _get('userIsCommCare', 'no', 'yes'),
                domain: _get('domain', 'none'),
                hasBuiltApp: _get('userHasBuiltApp', 'no', 'yes'),
            };

            // Update User Data & Legacy "Dimensions"
            var dimLabels = ['isDimagi', 'user_id', 'isCommCare', 'domain', 'hasBuiltApp'];
            if (user.user_id !== 'none') {
                user.daysOld = _get('userDaysSinceCreated');
                user.isFirstDay = user.daysOld < 1 ? 'yes' : 'no';
                dimLabels.push('isFirstDay');
                user.isFirstWeek = user.daysOld >= 1 && user.daysOld < 7 ? 'yes' : 'no';
                dimLabels.push('isFirstWeek');
            }
            // Legacy Dimensions
            user.custom_map = {};
            _.each(dimLabels, function (val, ind) {
                user.custom_map['dimension' + ind] = user[val];
            });

            // Configure Gtag with User Info
            _gtag('config', apiId, user);
        });
    });

    /**
     * Helper function for sending a Google Analytics Event.
     *
     * @param {string} eventCategory - The event category
     * @param {string} eventAction - The event action
     * @param {string} eventLabel - (optional) The event label
     * @param {string} eventValue - (optional) The event value
     * @param {object} eventParameters - (optional) Extra event parameters
     * @param {function} eventCallback - (optional) Event callback fn
     */
    var trackEvent = function (eventCategory, eventAction, eventLabel, eventValue, eventParameters, eventCallback) {
        var originalArgs = arguments;
        _ready.done(function() {
            var params = {
                event_category: eventCategory,
                event_label: eventLabel,
                event_value: eventValue,
                event_callback: eventCallback,
                event_action: eventAction,
            };
            if (_.isObject(eventParameters)) {
                params = _.extend(params, eventParameters);
            }
            _logger.debug.log(_logger.fmt.labelArgs(["Category", "Action", "Label", "Value", "Parameters", "Callback"], originalArgs), "Event Recorded");
            _gtag('event', eventAction, params);
        }).fail(function() {
            if (_.isFunction(eventCallback)) {
                eventCallback();
            }
        });
    };

    /**
     * Tracks an event when the given element is clicked.
     * Uses a callback to ensure that the request to the analytics services
     * completes before the default click action happens. This is useful if
     * the link would otherwise navigate away from the page.
     * @param {(object|string)} element - The element (or a selector) whose clicks you want to track.
     * @param {string} eventCategory - The event category
     * @param {string} eventAction - The event action
     * @param {string} eventLabel - (optional) The event label
     * @param {string} eventValue - (optional) The event value
     * @param {object} eventParameters - (optional) Extra event parameters
     */
    var trackClick = function (element, eventCategory, eventAction, eventLabel, eventValue, eventParameters) {
        var originalArgs = arguments;
        _ready.done(function() {
            utils.trackClickHelper(
                element,
                function (callbackFn) {
                    trackEvent(eventCategory, eventAction, eventLabel, eventValue, eventParameters, callbackFn);
                }
            );
            _logger.debug.log(_logger.fmt.labelArgs(["Element", "Category", "Action", "Label", "Value", "Parameters"], originalArgs), "Added Click Tracker");
        });
    };

    /**
     * Helper function that pre-fills the eventCategory field for all the
     * tracking helper functions. Useful if you want to track a lot of items
     * in a particular area of the site.
     * e.g. "Report Builder" would be the category
     *
     * @param {string} eventCategory - The event category
     */
    var trackCategory = function (eventCategory) {
        return {
            /**
             * @param {string} eventAction - The event action
             * @param {string} eventLabel - (optional) The event label
             * @param {string} eventValue - (optional) The event value
             * @param {object} eventParameters - (optional) Extra event parameters
             * @param {function} eventCallback - (optional) Event callback fn
             */
            event: function (eventAction, eventLabel, eventValue, eventParameters, eventCallback) {
                trackEvent(eventCategory, eventAction, eventLabel, eventValue, eventParameters, eventCallback);
            },
            /**
             * @param {(object|string)} element - The element (or a selector) whose clicks you want to track.
             * @param {string} eventAction - The event action
             * @param {string} eventLabel - (optional) The event label
             * @param {string} eventValue - (optional) The event value
             * @param {object} eventParameters - (optional) Extra event parameters
             */
            click: function (element, eventAction, eventLabel, eventValue, eventParameters) {
                // directly reference what the module returns instead of the private function,
                // as some mocha tests will want to replace the module's returned functions
                trackClick(element, eventCategory, eventLabel, eventValue, eventParameters);
            },
        };
    };

    return {
        track: {
            event: trackEvent,
            click: trackClick,
        },
        trackCategory: trackCategory,
    };
});

define("hqwebapp/js/hq.helpers", [
    'jquery',
    'knockout',
    'underscore',
    'analytix/js/google',
], function(
    $,
    ko,
    _,
    googleAnalytics
) {
    var clearAnnouncement = function (announcementID) {
        $.ajax({
            url: '/announcements/clear/' + announcementID,
        });
    };

    $('.page-level-alert').on('closed', function () {
        var announcement_id = $('.page-level-alert').find('.announcement-control').data('announcementid');
        if (announcement_id) {
            clearAnnouncement(announcement_id);
        }
    });

    // disable-on-submit is a class for form submit buttons so they're automatically disabled when the form is submitted
    $(document).on('submit', 'form', function(ev) {
        var form = $(ev.target);
        form.find('.disable-on-submit').disableButton();
        form.find('.disable-on-submit-no-spinner').disableButtonNoSpinner();
    });
    $(document).on('submit', 'form.disable-on-submit', function (ev) {
        $(ev.target).find('[type="submit"]').disableButton();
    });
    $(document).on('reset', 'form', function (ev) {
        $(ev.target).find('.disable-on-submit').enableButton();
    });
    $(document).on('reset', 'form.disable-on-submit', function (ev) {
        $(ev.target).enableButton();
    });
    $(document).on('click', '.add-spinner-on-click', function(ev) {
        $(ev.target).addSpinnerToButton();
    });

    $(document).on('click', '.notification-close-btn', function() {
        var note_id = $(this).data('note-id');
        var post_url = $(this).data('url');
        $.post(post_url, {note_id: note_id});
        $(this).parents('.alert').hide(150);
    });

    if ($.timeago) {
        $.timeago.settings.allowFuture = true;
        $(".timeago").timeago();
    }

    window.onerror = function(message, file, line, col, error) {
        $.post('/jserror/', {
            message: message,
            page: window.location.href,
            file: file,
            line: line,
            stack: error ? error.stack : null,
        });
        return false; // let default handler run
    };

    var oldHide = $.fn.popover.Constructor.prototype.hide;

    $.fn.popover.Constructor.prototype.hide = function() {
        if (this.options.trigger === "hover" && this.tip().is(":hover")) {
            var that = this;
            setTimeout(function() {
                return that.hide.apply(that, arguments);
            }, that.options.delay.hide);
            return;
        }
        oldHide.apply(this, arguments);
    };

    $.fn.hqHelp = function () {
        var self = this;
        self.each(function(i) {
            var $self = $(self),
                $helpElem = $($self.get(i)),
                $link = $helpElem.find('a');

            var options = {
                html: true,
                trigger: 'focus',
                container: 'body',
            };
            if (!$link.data('content')) {
                options.content = function() {
                    return $('#popover_content_wrapper').html();
                };
            }
            if (!$link.data("title")) {
                options.template = '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>';
            }
            $link.popover(options);

            // Prevent jumping to the top of the page when link is clicked
            $helpElem.find('a').click(function(event) {
                googleAnalytics.track.event("Clicked Help Bubble", $(this).data('title'), '-');
                event.preventDefault();
            });
        });
    };

    $.showMessage = function (message, level) {
        var $notice = $('<div />').addClass("alert fade in alert-block alert-full page-level-alert")
            .addClass("alert-" + level);
        var $closeIcon = $('<a />').addClass("close").attr("data-dismiss", "alert");
        $closeIcon.attr("href", "#").html("&times;");
        $notice.append($closeIcon);
        $notice.append(message);
        $(".hq-page-header-container").prepend($notice);
    };


    $.fn.addSpinnerToButton = function () {
        $(this).prepend('<i class="fa fa-refresh fa-spin icon-refresh icon-spin"></i> ');
    };


    $.fn.removeSpinnerFromButton = function () {
        $(this).find('i.fa-spin').remove();
    };


    $.fn.disableButtonNoSpinner = function () {
        $(this).prop('disabled', 'disabled')
            .addClass('disabled');
    };


    $.fn.disableButton = function () {
        $(this).disableButtonNoSpinner();
        $(this).addSpinnerToButton();
    };


    $.fn.enableButton = function () {
        $(this).removeSpinnerFromButton();
        $(this).removeClass('disabled')
            .prop('disabled', false);
    };

    $.fn.koApplyBindings = function (context) {
        if (!this.length) {
            throw new Error("No element passed to koApplyBindings");
        }
        if (this.length > 1) {
            throw new Error("Multiple elements passed to koApplyBindings");
        }
        ko.applyBindings(context, this.get(0));
        this.removeClass('ko-template');
    };

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            // Don't pass csrftoken cross domain
            // Ignore HTTP methods that do not require CSRF protection
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type) && !this.crossDomain) {
                var $csrf_token = $("#csrfTokenContainer").val();
                xhr.setRequestHeader("X-CSRFToken", $csrf_token);
            }
        },
    });

    // Return something so that hqModules understands that the module has been defined
    return 1;
});

define("hqwebapp/js/layout", ['jquery'], function($) {
    var self = {};

    self.selector = {
        navigation: '#hq-navigation',
        content: '#hq-content',
        appmanager: '#js-appmanager-body',
        footer: '#hq-footer',
        sidebar: '#hq-sidebar',
        breadcrumbs: '#hq-breadcrumbs',
        messages: '#hq-messages-container',
        publishStatus: '#js-publish-status',
    };

    self.values = {
        footerHeight: 0,
        isFooterVisible: true,
        isAppbuilderResizing: false,
    };

    self.balancePreviewPromise = $.Deferred();
    self.utils = {
        getCurrentScrollPosition: function () {
            return $(window).scrollTop() + $(window).height();
        },
        getFooterShowPosition: function () {
            return $(document).height() - (self.values.footerHeight / 3);
        },
        getAvailableContentWidth: function () {
            var $sidebar = $(self.selector.sidebar);
            // todo fix extra 10 px padding needed when sidebar suddenly disappears
            // on modal.
            var absorbedWidth = $sidebar.outerWidth();
            return $(window).outerWidth() - absorbedWidth;
        },
        getAvailableContentHeight: function () {
            var $navigation = $(self.selector.navigation),
                $footer = $(self.selector.footer),
                $breadcrumbs = $(self.selector.breadcrumbs),
                $messages = $(self.selector.messages);

            var absorbedHeight = $navigation.outerHeight();
            if ($footer.length) {
                absorbedHeight += $footer.outerHeight();
            }
            if ($breadcrumbs.length) {
                absorbedHeight += $breadcrumbs.outerHeight();
            }
            if ($messages.length) {
                absorbedHeight += $messages.outerHeight();
            }
            return $(window).height() - absorbedHeight;
        },
        isScrolledToFooter: function () {
            return self.utils.getCurrentScrollPosition() >= self.utils.getFooterShowPosition();
        },
        isScrollable: function () {
            return $(document).height() > $(window).height();
        },
        setIsAppbuilderResizing: function (isOn) {
            self.values.isAppbuilderResizing = isOn;
        },
        setBalancePreviewFn: function (fn) {
            self.balancePreviewPromise.resolve(fn);
        },
    };

    self.actions = {
        initialize: function () {
            self.values.footerHeight = $(self.selector.footer).innerHeight();
        },
        balanceSidebar: function () {
            var $sidebar = $(self.selector.sidebar),
                $content = $(self.selector.content),
                $appmanager = $(self.selector.appmanager);

            if ($appmanager.length) {
                var availableHeight = self.utils.getAvailableContentHeight(),
                    contentHeight = $appmanager.outerHeight();

                if ($sidebar.length) {
                    var newSidebarHeight = Math.max(availableHeight, contentHeight);
                    $sidebar.css('min-height', newSidebarHeight + 'px');

                    if ($sidebar.outerHeight() >  $appmanager.outerHeight()) {
                        $content.css('min-height', $sidebar.outerHeight() + 'px');
                        $appmanager.css('min-height', $sidebar.outerHeight() + 'px');
                    }
                }

            } else if ($content.length) {
                var availableHeight = self.utils.getAvailableContentHeight(),
                    contentHeight = $content.innerHeight();

                if (contentHeight > availableHeight) {
                    $content.css('padding-bottom', 15 + 'px');
                    contentHeight = $content.outerHeight();
                }

                if ($sidebar.length && !self.values.isAppbuilderResizing) {
                    var newSidebarHeight = Math.max(availableHeight, contentHeight);
                    $sidebar.css('min-height', newSidebarHeight + 'px');
                } else {
                    if ($sidebar.outerHeight() >  $content.outerHeight()) {
                        $content.css('min-height', $sidebar.outerHeight() + 'px');
                    }
                }
            }
        },
        balanceWidths: function () {
            var $content = $(self.selector.content),
                $sidebar = $(self.selector.sidebar),
                $appmanager = $(self.selector.appmanager);

            if ($content.length && $sidebar.length && $appmanager.length === 0) {
                $content.css('width', self.utils.getAvailableContentWidth() + 'px');
            }

        },
        balancePreview: function () {
            // set with setBalancePreviewFn in utils.
            self.balancePreviewPromise.done(function(callback) {
                if (_.isFunction(callback)) {
                    callback();
                }
            });
        },
        showPublishStatus: function() {
            $(self.selector.publishStatus).fadeIn();
        },
        hidePublishStatus: function() {
            $(self.selector.publishStatus).fadeOut();
        },
    };

    $(window).on('load', function () {
        self.actions.initialize();
        if (self.values.isAppbuilderResizing) {
            self.actions.balanceWidths();
        }
        self.actions.balanceSidebar();
        self.actions.balancePreview();
    });

    $(window).resize(function () {
        if (self.values.isAppbuilderResizing) {
            self.actions.balanceWidths();
        }
        self.actions.balanceSidebar();
        self.actions.balancePreview();
    });

    $(window).scroll(function () {
        self.actions.balanceSidebar();
    });

    return {
        getMessagesContainer: function() { return $(self.selector.messages); },
        getNavigationContainer: function() { return $(self.selector.navigation);},
        hidePublishStatus: self.actions.hidePublishStatus,
        showPublishStatus: self.actions.showPublishStatus,
        setBalancePreviewFn: self.utils.setBalancePreviewFn,
        setIsAppbuilderResizing: self.utils.setIsAppbuilderResizing,
    };
});

/*!
 * jQuery Form Plugin
 * version: 4.2.2
 * Requires jQuery v1.7.2 or later
 * Project repository: https://github.com/jquery-form/form

 * Copyright 2017 Kevin Morris
 * Copyright 2006 M. Alsup

 * Dual licensed under the LGPL-2.1+ or MIT licenses
 * https://github.com/jquery-form/form#license

 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 */
!function(e){"function"==typeof define&&define.amd?define('jquery-form/dist/jquery.form.min',["jquery"],e):"object"==typeof module&&module.exports?module.exports=function(t,r){return void 0===r&&(r="undefined"!=typeof window?require("jquery"):require("jquery")(t)),e(r),r}:e(jQuery)}(function(e){"use strict";function t(t){var r=t.data;t.isDefaultPrevented()||(t.preventDefault(),e(t.target).closest("form").ajaxSubmit(r))}function r(t){var r=t.target,a=e(r);if(!a.is("[type=submit],[type=image]")){var n=a.closest("[type=submit]");if(0===n.length)return;r=n[0]}var i=r.form;if(i.clk=r,"image"===r.type)if(void 0!==t.offsetX)i.clk_x=t.offsetX,i.clk_y=t.offsetY;else if("function"==typeof e.fn.offset){var o=a.offset();i.clk_x=t.pageX-o.left,i.clk_y=t.pageY-o.top}else i.clk_x=t.pageX-r.offsetLeft,i.clk_y=t.pageY-r.offsetTop;setTimeout(function(){i.clk=i.clk_x=i.clk_y=null},100)}function a(){if(e.fn.ajaxSubmit.debug){var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}}var n=/\r?\n/g,i={};i.fileapi=void 0!==e('<input type="file">').get(0).files,i.formdata=void 0!==window.FormData;var o=!!e.fn.prop;e.fn.attr2=function(){if(!o)return this.attr.apply(this,arguments);var e=this.prop.apply(this,arguments);return e&&e.jquery||"string"==typeof e?e:this.attr.apply(this,arguments)},e.fn.ajaxSubmit=function(t,r,n,s){function u(r){var a,n,i=e.param(r,t.traditional).split("&"),o=i.length,s=[];for(a=0;a<o;a++)i[a]=i[a].replace(/\+/g," "),n=i[a].split("="),s.push([decodeURIComponent(n[0]),decodeURIComponent(n[1])]);return s}function c(r){function n(e){var t=null;try{e.contentWindow&&(t=e.contentWindow.document)}catch(e){a("cannot get iframe.contentWindow document: "+e)}if(t)return t;try{t=e.contentDocument?e.contentDocument:e.document}catch(r){a("cannot get iframe.contentDocument: "+r),t=e.document}return t}function i(){function t(){try{var e=n(v).readyState;a("state = "+e),e&&"uninitialized"===e.toLowerCase()&&setTimeout(t,50)}catch(e){a("Server abort: ",e," (",e.name,")"),s(L),j&&clearTimeout(j),j=void 0}}var r=p.attr2("target"),i=p.attr2("action"),o=p.attr("enctype")||p.attr("encoding")||"multipart/form-data";w.setAttribute("target",m),l&&!/post/i.test(l)||w.setAttribute("method","POST"),i!==f.url&&w.setAttribute("action",f.url),f.skipEncodingOverride||l&&!/post/i.test(l)||p.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),f.timeout&&(j=setTimeout(function(){T=!0,s(A)},f.timeout));var u=[];try{if(f.extraData)for(var c in f.extraData)f.extraData.hasOwnProperty(c)&&(e.isPlainObject(f.extraData[c])&&f.extraData[c].hasOwnProperty("name")&&f.extraData[c].hasOwnProperty("value")?u.push(e('<input type="hidden" name="'+f.extraData[c].name+'">',k).val(f.extraData[c].value).appendTo(w)[0]):u.push(e('<input type="hidden" name="'+c+'">',k).val(f.extraData[c]).appendTo(w)[0]));f.iframeTarget||h.appendTo(D),v.attachEvent?v.attachEvent("onload",s):v.addEventListener("load",s,!1),setTimeout(t,15);try{w.submit()}catch(e){document.createElement("form").submit.apply(w)}}finally{w.setAttribute("action",i),w.setAttribute("enctype",o),r?w.setAttribute("target",r):p.removeAttr("target"),e(u).remove()}}function s(t){if(!x.aborted&&!X){if((O=n(v))||(a("cannot access response document"),t=L),t===A&&x)return x.abort("timeout"),void S.reject(x,"timeout");if(t===L&&x)return x.abort("server abort"),void S.reject(x,"error","server abort");if(O&&O.location.href!==f.iframeSrc||T){v.detachEvent?v.detachEvent("onload",s):v.removeEventListener("load",s,!1);var r,i="success";try{if(T)throw"timeout";var o="xml"===f.dataType||O.XMLDocument||e.isXMLDoc(O);if(a("isXml="+o),!o&&window.opera&&(null===O.body||!O.body.innerHTML)&&--C)return a("requeing onLoad callback, DOM not available"),void setTimeout(s,250);var u=O.body?O.body:O.documentElement;x.responseText=u?u.innerHTML:null,x.responseXML=O.XMLDocument?O.XMLDocument:O,o&&(f.dataType="xml"),x.getResponseHeader=function(e){return{"content-type":f.dataType}[e.toLowerCase()]},u&&(x.status=Number(u.getAttribute("status"))||x.status,x.statusText=u.getAttribute("statusText")||x.statusText);var c=(f.dataType||"").toLowerCase(),l=/(json|script|text)/.test(c);if(l||f.textarea){var p=O.getElementsByTagName("textarea")[0];if(p)x.responseText=p.value,x.status=Number(p.getAttribute("status"))||x.status,x.statusText=p.getAttribute("statusText")||x.statusText;else if(l){var m=O.getElementsByTagName("pre")[0],g=O.getElementsByTagName("body")[0];m?x.responseText=m.textContent?m.textContent:m.innerText:g&&(x.responseText=g.textContent?g.textContent:g.innerText)}}else"xml"===c&&!x.responseXML&&x.responseText&&(x.responseXML=q(x.responseText));try{M=N(x,c,f)}catch(e){i="parsererror",x.error=r=e||i}}catch(e){a("error caught: ",e),i="error",x.error=r=e||i}x.aborted&&(a("upload aborted"),i=null),x.status&&(i=x.status>=200&&x.status<300||304===x.status?"success":"error"),"success"===i?(f.success&&f.success.call(f.context,M,"success",x),S.resolve(x.responseText,"success",x),d&&e.event.trigger("ajaxSuccess",[x,f])):i&&(void 0===r&&(r=x.statusText),f.error&&f.error.call(f.context,x,i,r),S.reject(x,"error",r),d&&e.event.trigger("ajaxError",[x,f,r])),d&&e.event.trigger("ajaxComplete",[x,f]),d&&!--e.active&&e.event.trigger("ajaxStop"),f.complete&&f.complete.call(f.context,x,i),X=!0,f.timeout&&clearTimeout(j),setTimeout(function(){f.iframeTarget?h.attr("src",f.iframeSrc):h.remove(),x.responseXML=null},100)}}}var u,c,f,d,m,h,v,x,y,b,T,j,w=p[0],S=e.Deferred();if(S.abort=function(e){x.abort(e)},r)for(c=0;c<g.length;c++)u=e(g[c]),o?u.prop("disabled",!1):u.removeAttr("disabled");(f=e.extend(!0,{},e.ajaxSettings,t)).context=f.context||f,m="jqFormIO"+(new Date).getTime();var k=w.ownerDocument,D=p.closest("body");if(f.iframeTarget?(b=(h=e(f.iframeTarget,k)).attr2("name"))?m=b:h.attr2("name",m):(h=e('<iframe name="'+m+'" src="'+f.iframeSrc+'" />',k)).css({position:"absolute",top:"-1000px",left:"-1000px"}),v=h[0],x={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(t){var r="timeout"===t?"timeout":"aborted";a("aborting upload... "+r),this.aborted=1;try{v.contentWindow.document.execCommand&&v.contentWindow.document.execCommand("Stop")}catch(e){}h.attr("src",f.iframeSrc),x.error=r,f.error&&f.error.call(f.context,x,r,t),d&&e.event.trigger("ajaxError",[x,f,r]),f.complete&&f.complete.call(f.context,x,r)}},(d=f.global)&&0==e.active++&&e.event.trigger("ajaxStart"),d&&e.event.trigger("ajaxSend",[x,f]),f.beforeSend&&!1===f.beforeSend.call(f.context,x,f))return f.global&&e.active--,S.reject(),S;if(x.aborted)return S.reject(),S;(y=w.clk)&&(b=y.name)&&!y.disabled&&(f.extraData=f.extraData||{},f.extraData[b]=y.value,"image"===y.type&&(f.extraData[b+".x"]=w.clk_x,f.extraData[b+".y"]=w.clk_y));var A=1,L=2,F=e("meta[name=csrf-token]").attr("content"),E=e("meta[name=csrf-param]").attr("content");E&&F&&(f.extraData=f.extraData||{},f.extraData[E]=F),f.forceSync?i():setTimeout(i,10);var M,O,X,C=50,q=e.parseXML||function(e,t){return window.ActiveXObject?((t=new ActiveXObject("Microsoft.XMLDOM")).async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&"parsererror"!==t.documentElement.nodeName?t:null},_=e.parseJSON||function(e){return window.eval("("+e+")")},N=function(t,r,a){var n=t.getResponseHeader("content-type")||"",i=("xml"===r||!r)&&n.indexOf("xml")>=0,o=i?t.responseXML:t.responseText;return i&&"parsererror"===o.documentElement.nodeName&&e.error&&e.error("parsererror"),a&&a.dataFilter&&(o=a.dataFilter(o,r)),"string"==typeof o&&(("json"===r||!r)&&n.indexOf("json")>=0?o=_(o):("script"===r||!r)&&n.indexOf("javascript")>=0&&e.globalEval(o)),o};return S}if(!this.length)return a("ajaxSubmit: skipping submit process - no element selected"),this;var l,f,d,p=this;"function"==typeof t?t={success:t}:"string"==typeof t||!1===t&&arguments.length>0?(t={url:t,data:r,dataType:n},"function"==typeof s&&(t.success=s)):void 0===t&&(t={}),l=t.method||t.type||this.attr2("method"),(d=(d="string"==typeof(f=t.url||this.attr2("action"))?e.trim(f):"")||window.location.href||"")&&(d=(d.match(/^([^#]+)/)||[])[1]),t=e.extend(!0,{url:d,success:e.ajaxSettings.success,type:l||e.ajaxSettings.type,iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},t);var m={};if(this.trigger("form-pre-serialize",[this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(t.beforeSerialize&&!1===t.beforeSerialize(this,t))return a("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var h=t.traditional;void 0===h&&(h=e.ajaxSettings.traditional);var v,g=[],x=this.formToArray(t.semantic,g,t.filtering);if(t.data){var y=e.isFunction(t.data)?t.data(x):t.data;t.extraData=y,v=e.param(y,h)}if(t.beforeSubmit&&!1===t.beforeSubmit(x,this,t))return a("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[x,this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var b=e.param(x,h);v&&(b=b?b+"&"+v:v),"GET"===t.type.toUpperCase()?(t.url+=(t.url.indexOf("?")>=0?"&":"?")+b,t.data=null):t.data=b;var T=[];if(t.resetForm&&T.push(function(){p.resetForm()}),t.clearForm&&T.push(function(){p.clearForm(t.includeHidden)}),!t.dataType&&t.target){var j=t.success||function(){};T.push(function(r,a,n){var i=arguments,o=t.replaceTarget?"replaceWith":"html";e(t.target)[o](r).each(function(){j.apply(this,i)})})}else t.success&&(e.isArray(t.success)?e.merge(T,t.success):T.push(t.success));if(t.success=function(e,r,a){for(var n=t.context||this,i=0,o=T.length;i<o;i++)T[i].apply(n,[e,r,a||p,p])},t.error){var w=t.error;t.error=function(e,r,a){var n=t.context||this;w.apply(n,[e,r,a,p])}}if(t.complete){var S=t.complete;t.complete=function(e,r){var a=t.context||this;S.apply(a,[e,r,p])}}var k=e("input[type=file]:enabled",this).filter(function(){return""!==e(this).val()}).length>0,D="multipart/form-data",A=p.attr("enctype")===D||p.attr("encoding")===D,L=i.fileapi&&i.formdata;a("fileAPI :"+L);var F,E=(k||A)&&!L;!1!==t.iframe&&(t.iframe||E)?t.closeKeepAlive?e.get(t.closeKeepAlive,function(){F=c(x)}):F=c(x):F=(k||A)&&L?function(r){for(var a=new FormData,n=0;n<r.length;n++)a.append(r[n].name,r[n].value);if(t.extraData){var i=u(t.extraData);for(n=0;n<i.length;n++)i[n]&&a.append(i[n][0],i[n][1])}t.data=null;var o=e.extend(!0,{},e.ajaxSettings,t,{contentType:!1,processData:!1,cache:!1,type:l||"POST"});t.uploadProgress&&(o.xhr=function(){var r=e.ajaxSettings.xhr();return r.upload&&r.upload.addEventListener("progress",function(e){var r=0,a=e.loaded||e.position,n=e.total;e.lengthComputable&&(r=Math.ceil(a/n*100)),t.uploadProgress(e,a,n,r)},!1),r}),o.data=null;var s=o.beforeSend;return o.beforeSend=function(e,r){t.formData?r.data=t.formData:r.data=a,s&&s.call(this,e,r)},e.ajax(o)}(x):e.ajax(t),p.removeData("jqxhr").data("jqxhr",F);for(var M=0;M<g.length;M++)g[M]=null;return this.trigger("form-submit-notify",[this,t]),this},e.fn.ajaxForm=function(n,i,o,s){if(("string"==typeof n||!1===n&&arguments.length>0)&&(n={url:n,data:i,dataType:o},"function"==typeof s&&(n.success=s)),n=n||{},n.delegation=n.delegation&&e.isFunction(e.fn.on),!n.delegation&&0===this.length){var u={s:this.selector,c:this.context};return!e.isReady&&u.s?(a("DOM not ready, queuing ajaxForm"),e(function(){e(u.s,u.c).ajaxForm(n)}),this):(a("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return n.delegation?(e(document).off("submit.form-plugin",this.selector,t).off("click.form-plugin",this.selector,r).on("submit.form-plugin",this.selector,n,t).on("click.form-plugin",this.selector,n,r),this):this.ajaxFormUnbind().on("submit.form-plugin",n,t).on("click.form-plugin",n,r)},e.fn.ajaxFormUnbind=function(){return this.off("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(t,r,a){var n=[];if(0===this.length)return n;var o,s=this[0],u=this.attr("id"),c=t||void 0===s.elements?s.getElementsByTagName("*"):s.elements;if(c&&(c=e.makeArray(c)),u&&(t||/(Edge|Trident)\//.test(navigator.userAgent))&&(o=e(':input[form="'+u+'"]').get()).length&&(c=(c||[]).concat(o)),!c||!c.length)return n;e.isFunction(a)&&(c=e.map(c,a));var l,f,d,p,m,h,v;for(l=0,h=c.length;l<h;l++)if(m=c[l],(d=m.name)&&!m.disabled)if(t&&s.clk&&"image"===m.type)s.clk===m&&(n.push({name:d,value:e(m).val(),type:m.type}),n.push({name:d+".x",value:s.clk_x},{name:d+".y",value:s.clk_y}));else if((p=e.fieldValue(m,!0))&&p.constructor===Array)for(r&&r.push(m),f=0,v=p.length;f<v;f++)n.push({name:d,value:p[f]});else if(i.fileapi&&"file"===m.type){r&&r.push(m);var g=m.files;if(g.length)for(f=0;f<g.length;f++)n.push({name:d,value:g[f],type:m.type});else n.push({name:d,value:"",type:m.type})}else null!==p&&void 0!==p&&(r&&r.push(m),n.push({name:d,value:p,type:m.type,required:m.required}));if(!t&&s.clk){var x=e(s.clk),y=x[0];(d=y.name)&&!y.disabled&&"image"===y.type&&(n.push({name:d,value:x.val()}),n.push({name:d+".x",value:s.clk_x},{name:d+".y",value:s.clk_y}))}return n},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var r=[];return this.each(function(){var a=this.name;if(a){var n=e.fieldValue(this,t);if(n&&n.constructor===Array)for(var i=0,o=n.length;i<o;i++)r.push({name:a,value:n[i]});else null!==n&&void 0!==n&&r.push({name:this.name,value:n})}}),e.param(r)},e.fn.fieldValue=function(t){for(var r=[],a=0,n=this.length;a<n;a++){var i=this[a],o=e.fieldValue(i,t);null===o||void 0===o||o.constructor===Array&&!o.length||(o.constructor===Array?e.merge(r,o):r.push(o))}return r},e.fieldValue=function(t,r){var a=t.name,i=t.type,o=t.tagName.toLowerCase();if(void 0===r&&(r=!0),r&&(!a||t.disabled||"reset"===i||"button"===i||("checkbox"===i||"radio"===i)&&!t.checked||("submit"===i||"image"===i)&&t.form&&t.form.clk!==t||"select"===o&&-1===t.selectedIndex))return null;if("select"===o){var s=t.selectedIndex;if(s<0)return null;for(var u=[],c=t.options,l="select-one"===i,f=l?s+1:c.length,d=l?s:0;d<f;d++){var p=c[d];if(p.selected&&!p.disabled){var m=p.value;if(m||(m=p.attributes&&p.attributes.value&&!p.attributes.value.specified?p.text:p.value),l)return m;u.push(m)}}return u}return e(t).val().replace(n,"\r\n")},e.fn.clearForm=function(t){return this.each(function(){e("input,select,textarea",this).clearFields(t)})},e.fn.clearFields=e.fn.clearInputs=function(t){var r=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var a=this.type,n=this.tagName.toLowerCase();r.test(a)||"textarea"===n?this.value="":"checkbox"===a||"radio"===a?this.checked=!1:"select"===n?this.selectedIndex=-1:"file"===a?/MSIE/.test(navigator.userAgent)?e(this).replaceWith(e(this).clone(!0)):e(this).val(""):t&&(!0===t&&/hidden/.test(a)||"string"==typeof t&&e(this).is(t))&&(this.value="")})},e.fn.resetForm=function(){return this.each(function(){var t=e(this),r=this.tagName.toLowerCase();switch(r){case"input":this.checked=this.defaultChecked;case"textarea":return this.value=this.defaultValue,!0;case"option":case"optgroup":var a=t.parents("select");return a.length&&a[0].multiple?"option"===r?this.selected=this.defaultSelected:t.find("option").resetForm():a.resetForm(),!0;case"select":return t.find("option").each(function(e){if(this.selected=this.defaultSelected,this.defaultSelected&&!t[0].multiple)return t[0].selectedIndex=e,!1}),!0;case"label":var n=e(t.attr("for")),i=t.find("input,select,textarea");return n[0]&&i.unshift(n[0]),i.resetForm(),!0;case"form":return("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset(),!0;default:return t.find("form,input,label,select,textarea").resetForm(),!0}})},e.fn.enable=function(e){return void 0===e&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return void 0===t&&(t=!0),this.each(function(){var r=this.type;if("checkbox"===r||"radio"===r)this.checked=t;else if("option"===this.tagName.toLowerCase()){var a=e(this).parent("select");t&&a[0]&&"select-one"===a[0].type&&a.find("option").selected(!1),this.selected=t}})},e.fn.ajaxSubmit.debug=!1});
//# sourceMappingURL=jquery.form.min.js.map
;
define('hqwebapp/js/hq-bug-report', [
    "jquery", "jquery-form/dist/jquery.form.min", "hqwebapp/js/hq.helpers",
], function($) {
    $(function () {
        var $hqwebappBugReportModal = $('#modalReportIssue'),
            $hqwebappBugReportForm = $('#hqwebapp-bugReportForm'),
            $hqwebappBugReportSubmit = $('#bug-report-submit'),
            $hqwebappBugReportCancel = $('#bug-report-cancel'),
            $ccFormGroup = $("#bug-report-cc-form-group"),
            $emailFormGroup = $("#bug-report-email-form-group"),
            $issueSubjectFormGroup = $("#bug-report-subject-form-group"),
            isBugReportSubmitting = false;

        var resetForm = function () {
            $hqwebappBugReportForm.find("button[type='submit']").button('reset');
            $hqwebappBugReportForm.resetForm();
            $hqwebappBugReportSubmit.button('reset');
            $ccFormGroup.removeClass('has-error has-feedback');
            $ccFormGroup.find(".label-danger").addClass('hide');
            $emailFormGroup.removeClass('has-error has-feedback');
            $emailFormGroup.find(".label-danger").addClass('hide');
        };

        $hqwebappBugReportModal.on('shown.bs.modal', function() {
            $("input#bug-report-subject").focus();
        });

        $hqwebappBugReportForm.submit(function() {
            var isDescriptionEmpty = !$("#bug-report-subject").val() && !$("#bug-report-message").val();
            if (isDescriptionEmpty) {
                highlightInvalidField($issueSubjectFormGroup);
            }

            var emailAddress = $(this).find("input[name='email']").val();
            if (emailAddress && !IsValidEmail(emailAddress)){
                highlightInvalidField($emailFormGroup);
                return false;
            }

            var emailAddresses = $(this).find("input[name='cc']").val();
            emailAddresses = emailAddresses.replace(/ /g, "").split(",");
            for (var index in emailAddresses){
                var email = emailAddresses[index];
                if (email && !IsValidEmail(email)){
                    highlightInvalidField($ccFormGroup);
                    return false;
                }
            }
            if (isDescriptionEmpty) {
                return false;
            }

            if (!isBugReportSubmitting && $hqwebappBugReportSubmit.text() === $hqwebappBugReportSubmit.data("success-text")) {
                $hqwebappBugReportModal.modal("hide");
            } else if (!isBugReportSubmitting) {
                $hqwebappBugReportCancel.disableButtonNoSpinner();
                $hqwebappBugReportSubmit.button('loading');
                $(this).ajaxSubmit({
                    type: "POST",
                    url: $(this).attr('action'),
                    beforeSerialize: hqwebappBugReportBeforeSerialize,
                    beforeSubmit: hqwebappBugReportBeforeSubmit,
                    success: hqwebappBugReportSucccess,
                    error: hqwebappBugReportError,
                });
            }
            return false;
        });

        function IsValidEmail(email) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        }

        function hqwebappBugReportBeforeSerialize($form) {
            $form.find("#bug-report-url").val(location.href);
        }

        function hqwebappBugReportBeforeSubmit() {
            isBugReportSubmitting = true;
        }

        function hqwebappBugReportSucccess() {
            isBugReportSubmitting = false;
            $hqwebappBugReportForm.find("button[type='submit']").button('success').removeClass('btn-primary btn-danger').addClass('btn-success');
            $hqwebappBugReportModal.one('hidden.bs.modal', function () {
                resetForm();
            });
        }

        function hqwebappBugReportError() {
            isBugReportSubmitting = false;
            $hqwebappBugReportForm.find("button[type='submit']").button('error').removeClass('btn-primary btn-success').addClass('btn-danger');
            $hqwebappBugReportCancel.enableButton();
        }

        function highlightInvalidField($element) {
            $element.addClass('has-error has-feedback');
            $element.find(".label-danger").removeClass('hide');
            $element.find("input").focus(function(){
                $element.removeClass("has-error has-feedback");
                $element.find(".label-danger").addClass('hide');
            });
        }
    });
});

/*
 * Adds URL hash behavior to bootstrap tabs. This enables bookmarking/refreshing and browser back/forward.
 * Lightly modified from https://stackoverflow.com/questions/18999501/bootstrap-3-keep-selected-tab-on-page-refresh
 */
define("hqwebapp/js/sticky_tabs", [
    "jquery",
    "bootstrap",    // needed for $.tab
], function(
    $
) {
    var getHash = function() {
        if (window.location.hash) {
            // .replace handles the #history?form_id=foo style of URL hashes used by
            // the case data page's history tab (case_data.js)
            return window.location.hash.replace(/\?.*/, "");
        }
        return "";
    };

    $(function(){
        var tabSelector = "a[data-toggle='tab']",
            navSelector = ".nav.sticky-tabs",
            hash = getHash(),
            $tabFromUrl = hash ? $("a[href='" + hash + "']") : undefined;

        if ($tabFromUrl && $tabFromUrl.length) {
            $tabFromUrl.tab('show');
        } else {
            $(navSelector + ' ' + tabSelector).first().tab('show');
        }

        $('body').on('click', tabSelector, function (e) {
            var $link = $(this);
            if (!$link.closest(navSelector).length) {
                return true;
            }
            e.preventDefault();
            var tabName = $link.attr('href');
            if (window.history.pushState) {
                window.history.pushState(null, null, tabName);
            } else {
                window.location.hash = tabName;
            }

            $link.tab('show');
            return false;
        });

        $(window).on('popstate', function () {
            var anchor = getHash() || $(navSelector + ' ' + tabSelector).first().attr('href');
            $("a[href='" + anchor + "']").tab('show');
        });
    });
});

/*
    This is the knockout-based, javascript analog of messages in Django.

    Use the function `alert_user` to make a message appear on the page.
    This accepts three args, message, emphasis and append.
    Emphasis corresponds to bootstrap styling, and can be
    "success", "danger", "info", or "warning".
    If specified, "append" will cause the message to be appended to the existing notification
    bubble (as opposed to making a new bubble).
    NOTE: append will change the class of the alert if it is more severe
    (success < info < warning < danger)

    alert_user("Awesome job!", "success", true);
*/
define("hqwebapp/js/alert_user", [
    "jquery",
    "knockout",
    "hqwebapp/js/hq.helpers",
],
function(
    $,
    ko
) {
    var message_alert = function(message, tags) {
        var alert_obj = {
            "message": ko.observable(message),
            "alert_class": ko.observable(
                "alert fade in alert-block alert-full page-level-alert message-alert"
            ),
        };
        if (tags) {
            alert_obj.alert_class(alert_obj.alert_class() + " " + tags);
        }
        return alert_obj;
    };
    var message_alerts = ko.observableArray();

    var alert_user = function(message, emphasis, append) {
        var tags = "alert-" + emphasis;
        if (!append || message_alerts().length === 0) {
            message_alerts.push(message_alert(message, tags));
        } else {
            var alert = message_alerts()[0];
            alert.message(alert.message() + "<br>" + message);
            if (!alert.alert_class().includes(tags)) {
                alert.alert_class(alert.alert_class() + ' ' + tags);
            }
        }
    };

    $(function() {
        // remove closed alerts from backend model
        $(document).on('close.bs.alert','.message-alert', function() {
            message_alerts.remove(ko.dataFor(this));
        });

        var message_element = $("#message-alerts").get(0);
        ko.cleanNode(message_element);
        $(message_element).koApplyBindings({
            alerts: message_alerts,
        });
    });

    return {
        alert_user: alert_user,
    };
});

define("hqwebapp/js/hq_extensions.jquery", ["jquery"], function($) {
    'use strict';
    $.extend({
        postGo: function (url, params) {
            params.csrfmiddlewaretoken = $("#csrfTokenContainer").val();
            var $form = $("<form>")
                .attr("method", "post")
                .attr("action", url);
            $.each(params, function (name, value) {
                $("<input type='hidden'>")
                    .attr("name", name)
                    .attr("value", value)
                    .appendTo($form);
            });
            $form.appendTo("body");
            $form.submit();
        },
        // thanks to http://stackoverflow.com/questions/1131630/javascript-jquery-param-inverse-function#1131658
        unparam: function (value) {
            var
            // Object that holds names => values.
                params = {},
                // Get query string pieces (separated by &)
                pieces = value.split('&'),
                // Temporary variables used in loop.
                pair, i, l;

            // Loop through query string pieces and assign params.
            for (i = 0, l = pieces.length; i < l; i += 1) {
                pair = pieces[i].split('=', 2);
                // Repeated parameters with the same name are overwritten. Parameters
                // with no value get set to boolean true.
                params[decodeURIComponent(pair[0])] = (pair.length === 2 ?
                    decodeURIComponent(pair[1].replace(/\+/g, ' ')) : true);
            }

            return params;
        },
    });

    return 1;   // Flag the module as loaded by hqModules.js
});

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define('jquery.cookie/jquery.cookie',['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

define('hqwebapp/js/main', [
    "jquery",
    "knockout",
    "underscore",
    "hqwebapp/js/initial_page_data",
    "hqwebapp/js/alert_user",
    "analytix/js/google",
    "hqwebapp/js/hq_extensions.jquery",
    "jquery.cookie/jquery.cookie",
], function(
    $,
    ko,
    _,
    initialPageData,
    alertUser,
    googleAnalytics
) {
    var eventize = function (that) {
        'use strict';
        var events = {};
        that.on = function (tag, callback) {
            if (events[tag] === undefined) {
                events[tag] = [];
            }
            events[tag].push(callback);
            return that;
        };
        that.fire = function (tag, e) {
            var i;
            if (events[tag] !== undefined) {
                for (i = 0; i < events[tag].length; i += 1) {
                    events[tag][i].apply(that, [e]);
                }
            }
            return that;
        };
        return that;
    };

    var makeHqHelp = function (opts, wrap) {
        'use strict';
        wrap = wrap === undefined ? true : wrap;
        var el = $(
            '<div class="hq-help">' +
                '<a href="#" tabindex="-1">' +
                    '<i class="fa fa-question-circle icon-question-sign"></i></a></div>'
        );
        _.each(['content', 'title', 'html', 'placement', 'container'], function(attr) {
            $('a', el).data(attr, opts[attr]);
        });
        if (wrap) {
            el.hqHelp();
        }
        return el;
    };

    var transformHelpTemplate = function ($template, wrap) {
        'use strict';
        if ($template.data()) {
            var $help = makeHqHelp($template.data(), wrap);
            $help.insertAfter($template);
            $template.remove();
        }
    };

    ko.bindingHandlers.makeHqHelp = {
        update: function(element, valueAccessor) {
            var opts = valueAccessor(),
                name = ko.utils.unwrapObservable(opts.name || $(element).data('title')),
                description = ko.utils.unwrapObservable(opts.description || $(element).data('content')),
                placement = ko.utils.unwrapObservable(opts.placement || $(element).data('placement')),
                format = ko.utils.unwrapObservable(opts.format);
            $(element).find('.hq-help').remove();
            makeHqHelp({
                title: name,
                content: description,
                html: format === 'html',
                placement: placement || 'right',
            }).appendTo(element);
        },
    };

    var initBlock = function ($elem) {
        'use strict';

        $('.submit').click(function (e) {
            var $form = $(this).closest('.form, form'),
                data = $form.find('[name]').serialize(),
                action = $form.attr('action') || $form.data('action');

            e.preventDefault();
            $.postGo(action, $.unparam(data));
        });

        $(".button", $elem).button().wrap('<span />');
        $("input[type='submit']", $elem).button();
        $("input[type='text'], input[type='password'], textarea", $elem);
        $('.container', $elem).addClass('ui-widget ui-widget-content');
        $('.config', $elem).wrap('<div />').parent().addClass('container block ui-corner-all');

        $('.hq-help-template').each(function () {
            transformHelpTemplate($(this), true);
        });
    };

    var updateDOM = function (update) {
        'use strict';
        var key;
        for (key in update) {
            if (update.hasOwnProperty(key)) {
                $(key).text(update[key]).val(update[key]);
            }
        }
    };

    var makeSaveButton = function(messageStrings, cssClass, barClass) {
        'use strict';
        var BAR_STATE = {
            SAVE: 'savebtn-bar-save',
            SAVING: 'savebtn-bar-saving',
            SAVED: 'savebtn-bar-saved',
            RETRY: 'savebtn-bar-retry',
        };
        barClass = barClass || '';
        var SaveButton = {
            /*
             options: {
             save: "Function to call when the user clicks Save",
             unsavedMessage: "Message to display when there are unsaved changes and the user leaves the page"
             }
             */
            init: function (options) {
                var button = {
                    $save: $('<div/>').text(SaveButton.message.SAVE).click(function () {
                        button.fire('save');
                    }).addClass(cssClass),
                    $retry: $('<div/>').text(SaveButton.message.RETRY).click(function () {
                        button.fire('save');
                    }).addClass(cssClass),
                    $saving: $('<div/>').text(SaveButton.message.SAVING).addClass('btn btn-default disabled'),
                    $saved: $('<div/>').text(SaveButton.message.SAVED).addClass('btn btn-default disabled'),
                    ui: $('<div/>').addClass('pull-right savebtn-bar ' + barClass),
                    setStateWhenReady: function (state) {
                        if (this.state === 'saving') {
                            this.nextState = state;
                        } else {
                            this.setState(state);
                        }
                    },
                    setState: function (state) {
                        if (this.state === state) {
                            return;
                        }
                        this.state = state;
                        this.$save.detach();
                        this.$saving.detach();
                        this.$saved.detach();
                        this.$retry.detach();
                        var buttonUi = this.ui;
                        _.each(BAR_STATE, function (v, k) {
                            buttonUi.removeClass(v);
                        });
                        if (state === 'save') {
                            this.ui.addClass(BAR_STATE.SAVE);
                            this.ui.append(this.$save);
                        } else if (state === 'saving') {
                            this.ui.addClass(BAR_STATE.SAVING);
                            this.ui.append(this.$saving);
                        } else if (state === 'saved') {
                            this.ui.addClass(BAR_STATE.SAVED);
                            this.ui.append(this.$saved);
                        } else if (state === 'retry') {
                            this.ui.addClass(BAR_STATE.RETRY);
                            this.ui.append(this.$retry);
                        }
                    },
                    ajax: function (options) {
                        var beforeSend = options.beforeSend || function () {},
                            success = options.success || function () {},
                            error = options.error || function () {},
                            that = this;
                        options.beforeSend = function (jqXHR, settings) {
                            that.setState('saving');
                            that.nextState = 'saved';
                            $.ajaxSettings.beforeSend(jqXHR, settings);
                            beforeSend.apply(this, arguments);
                        };
                        options.success = function (data) {
                            that.setState(that.nextState);
                            success.apply(this, arguments);
                        };
                        options.error = function (data) {
                            that.nextState = null;
                            that.setState('retry');
                            var customError = ((data.responseJSON && data.responseJSON.message) ? data.responseJSON.message : data.responseText);
                            if (customError.indexOf('<head>') > -1) {
                                // this is sending back a full html page, likely login, so no error message.
                                customError = null;
                            }
                            alertUser.alert_user(customError || SaveButton.message.ERROR_SAVING, 'danger');
                            error.apply(this, arguments);
                        };
                        var jqXHR = $.ajax(options);
                        if (!jqXHR) {
                            // request was aborted
                            that.setState('save');
                        }
                    },
                };
                eventize(button);
                button.setState('saved');
                button.on('change', function () {
                    this.setStateWhenReady('save');
                });
                if (options.save) {
                    button.on('save', options.save);
                }
                $(window).on('beforeunload', function () {
                    var lastParent = button.ui.parents()[button.ui.parents().length - 1];
                    if (lastParent) {
                        var stillAttached = lastParent.tagName.toLowerCase() == 'html';
                        if (button.state !== 'saved' && stillAttached) {
                            if ($('.js-unhide-on-unsaved').length > 0) $('.js-unhide-on-unsaved').removeClass('hide');
                            return options.unsavedMessage || "";
                        }
                    }
                });
                return button;
            },
            initForm: function ($form, options) {
                var url = $form.attr('action'),
                    button = SaveButton.init({
                        unsavedMessage: options.unsavedMessage,
                        save: function () {
                            this.ajax({
                                url: url,
                                type: 'POST',
                                dataType: 'json',
                                data: $form.serialize(),
                                success: options.success,
                            });
                        },
                    }),
                    fireChange = function () {
                        button.fire('change');
                    };
                _.defer(function () {
                    $form.find('*').change(fireChange);
                    $form.find('input, textarea').on('textchange', fireChange);
                });
                return button;
            },
            message: messageStrings,
        };

        return SaveButton;
    };

    var SaveButton = makeSaveButton({
        SAVE: django.gettext("Save"),
        SAVING: django.gettext("Saving..."),
        SAVED: django.gettext("Saved"),
        RETRY: django.gettext("Try Again"),
        ERROR_SAVING: django.gettext("There was an error saving"),
    }, 'btn btn-success');

    var DeleteButton = makeSaveButton({
        SAVE: django.gettext("Delete"),
        SAVING: django.gettext("Deleting..."),
        SAVED: django.gettext("Deleted"),
        RETRY: django.gettext("Try Again"),
        ERROR_SAVING: django.gettext("There was an error deleting"),
    }, 'btn btn-danger', 'savebtn-bar-danger');

    ko.bindingHandlers.saveButton = {
        init: function(element, getSaveButton) {
            getSaveButton().ui.appendTo(element);
        },
    };

    ko.bindingHandlers.saveButton2 = {
        init: function(element, valueAccessor, allBindingsAccessor) {
            var saveOptions = allBindingsAccessor().saveOptions,
                state = valueAccessor(),
                saveButton;

            saveButton = SaveButton.init({
                save: function() {
                    saveButton.ajax(saveOptions());
                },
            });
            $(element).css('vertical-align', 'top').css('display', 'inline-block');

            saveButton.ui.appendTo(element);
            element.saveButton = saveButton;
            saveButton.on('state:change', function() {
                state(saveButton.state);
            });
        },
        update: function(element, valueAccessor) {
            var state = ko.utils.unwrapObservable(valueAccessor());
            element.saveButton.setStateWhenReady(state);
        },
    };

    ko.bindingHandlers.deleteButton = {
        init: function(element, valueAccessor, allBindingsAccessor) {
            var saveOptions = allBindingsAccessor().saveOptions,
                state = valueAccessor(),
                deleteButton;

            deleteButton = initDeleteButton({
                save: function() {
                    deleteButton.ajax(saveOptions());
                },
            });
            $(element).css('vertical-align', 'top').css('display', 'inline-block');
            deleteButton.ui.appendTo(element);
            element.deleteButton = deleteButton;
            deleteButton.on('state:change', function() {
                state(deleteButton.state);
            });
        },
        update: function(element, valueAccessor) {
            var state = ko.utils.unwrapObservable(valueAccessor());
            element.deleteButton.setStateWhenReady(state);
        },
    };

    var beforeUnload = [];
    var bindBeforeUnload = function (callback) {
        beforeUnload.push(callback);
    };
    var beforeUnloadCallback = function () {
        for (var i = 0; i < beforeUnload.length; i++) {
            var message = beforeUnload[i]();
            if (message !== null && message !== undefined) {
                return message;
            }
        }
    };

    $(function () {
        'use strict';
        $(window).on('beforeunload', beforeUnloadCallback);
        initBlock($("body"));

        $('#modalTrial30Day').modal('show');

        $(document).on('click', '.track-usage-link', function(e) {
            var $link = $(e.currentTarget),
                data = $link.data();
            googleAnalytics.track.click($link, data.category, data.action, data.label, data.value);
        });

        $(document).on('click', '.mainmenu-tab a', function(e) {
            var data = $(e.currentTarget).closest(".mainmenu-tab").data();
            if (data.category && data.action) {
                googleAnalytics.track.event(data.category, data.action, data.label);
            }
        });

        $(document).on('click', '.post-link', function(e) {
            e.preventDefault();
            $.postGo($(this).attr('href'), {});
        });

        // Maintenance alerts
        var $maintenance = $(".alert-maintenance");
        if ($maintenance.length) {
            var id = $maintenance.data("id"),
                alertCookie = "alert_maintenance";
            if ($.cookie(alertCookie) == id) {  // eslint-disable-line eqeqeq
                $maintenance.addClass('hide');
            } else {
                $maintenance.on('click', '.close', function() {
                    $.cookie(alertCookie, id, { expires: 7, path: '/' });
                });
            }
        }

        // EULA modal
        var eulaCookie = "gdpr_rollout";
        if (!$.cookie(eulaCookie)) {
            var $modal = $("#eulaModal");
            if ($modal.length) {
                $("body").addClass("has-eula");
                $("#eula-agree").click(function() {
                    $(this).disableButton();
                    $.ajax({
                        url: initialPageData.reverse("agree_to_eula"),
                        method: "POST",
                        success: function() {
                            $("#eulaModal").modal('hide');
                            $("body").removeClass("has-eula");
                        },
                        error: function() {
                            // do nothing, user will get the popup again on next page load
                            $("body").removeClass("has-eula");
                        },
                    });
                });
                $modal.modal({
                    keyboard: false,
                    backdrop: 'static',
                });
            }
        }

        // CDA modal
        _.each($(".remote-modal"), function(modal) {
            var $modal = $(modal);
            $modal.on("show show.bs.modal", function() {
                $(this).find(".fetched-data").load($(this).data("url"));
            });
            if ($modal.data("showOnPageLoad")) {
                $modal.modal('show');
            }
        });
    });

    var capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    };

    return {
        beforeUnloadCallback: beforeUnloadCallback,
        eventize: eventize,
        initBlock: initBlock,
        initDeleteButton: DeleteButton.init,
        initSaveButton: SaveButton.init,
        makeSaveButton: makeSaveButton,
        SaveButton: SaveButton,
        initSaveButtonForm: SaveButton.initForm,
        makeHqHelp: makeHqHelp,
        transformHelpTemplate: transformHelpTemplate,
        updateDOM: updateDOM,
        capitalize: capitalize,
    };
});

/**
 * Remote Method Invocation object
 *
 * Usage:
 *
 *  var rmi = RMI("/some/url", "optional-csrf-token");
 *  rmi("remote_method_name", {arbitrary: "object"})
 *      .done(function (data) {
 *          // handle success
 *          // data: deserialized JSON object returned by the remote method
 *      })
 *      .fail(function (jqXHR, textStatus, errorThrown) {
 *          // handle error
 *      });
 *
 *
 * Alternate usage with django-angular template tags:
 *
 *  var rmi = RMI({% djng_current_rmi %}, "optional-csrf-token");
 *  rmi.remote_method_name({arbitrary: "object"})
 *      .done(function (result) { ... })
 *      .fail(function (jqXHR, textStatus, errorThrown) { ... });
 *
 *  var rmi = RMI({% djng_all_rmi %}, "optional-csrf-token");
 *  rmi.viewname.remote_method_name({arbitrary: "object"})
 *      .done(function (result) { ... })
 *      .fail(function (jqXHR, textStatus, errorThrown) { ... });
 */
function RMI(baseUrl, csrfToken, ajax) {

    function rmi(func, data, options) {
        var config = {
            processData: false,
            contentType: 'application/json',
        };
        if (options) {
            if (options && options.method === "POST" && data === undefined) {
                throw new Error(
                    "Calling remote method " + func + " without data object");
            }
            each(options, function (val, name) { config[name] = val; });
        }
        if (config.method === "auto" || config.method === undefined) {
            config.method = data === undefined ? "GET" : "POST";
        }
        config.data = JSON.stringify(data);
        config.url = join(baseUrl, func);
        config.beforeSend = function (xhr) {
            if (csrfToken && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        };
        return ajax(config);
    }

    function makeMethod(name, method, byUrl) {
        var rmi;
        if (byUrl.hasOwnProperty(method.url)) {
            rmi = byUrl[method.url];
        } else {
            rmi = byUrl[method.url] = RMI(method.url, csrfToken, ajax);
        }
        return function (data) {
            if (method.method === "POST" && data === undefined) {
                throw new Error(
                    "Calling remote method " + name + " without data object");
            }
            return rmi("", data, method);
        };
    }

    function configureMethods(rmi, obj, byUrl) {
        each(obj, function (val, name) {
            if (val.hasOwnProperty("url")) {
                rmi[name] = makeMethod(name, val, byUrl);
            } else {
                // recursive config
                rmi[name] = {};
                configureMethods(rmi[name], val, byUrl);
            }
        });
    }

    function each(obj, func) {
        var name;
        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                func(obj[name], name);
            }
        }
    }

    function join(base, rel) {
        if (base.slice(-1) === "/") {
            base = base.slice(0, -1);
        }
        if (rel[0] === "/" || rel.slice(-1) === "/") {
            throw new Error("invalid method name: " + rel);
        }
        return [base, "/", rel, (rel ? "/" : "")].join("");
    }

    if (ajax === undefined) {
        if (typeof jQuery !== "undefined") {
            ajax = jQuery.ajax;
        } else {
            ajax = require("jquery").ajax;
        }
    }
    if (typeof baseUrl !== "string") {
        configureMethods(rmi, baseUrl, {});
        //baseUrl = window.location;
    }
    return rmi;
}

if (typeof module !== "undefined") {
    module.exports = RMI;
}
;
define("jquery.rmi/jquery.rmi", ["jquery","knockout","underscore"], (function (global) {
    return function () {
        var ret, fn;
        return ret || global.RMI;
    };
}(this)));

/**
 * NotificationsService communicates with the NotificationsServiceRMIView django view
 * to fetch and update notifications for users on CommCare HQ.
 *
 */

define('notifications/js/notifications_service', [
    'jquery',
    'knockout',
    'underscore',
    'jquery.rmi/jquery.rmi',
    'hqwebapp/js/hq.helpers',
], function (
    $,
    ko,
    _,
    RMI
) {
    'use strict';

    // Workaround for non-RequireJS pages: when `define` doesn't exist, RMI is just a global variable.
    RMI = RMI || window.RMI;

    var module = {};
    var _private = {};
    _private.RMI = function () {};

    module.setRMI = function (rmiUrl, csrfToken) {
        var _rmi = RMI(rmiUrl, csrfToken);
        _private.RMI = function (remoteMethod, data) {
            return _rmi("", data, {headers: {"DjNg-Remote-Method": remoteMethod}});
        };
    };

    var Notification = function (data) {
        var self = this;
        self.id = ko.observable(data.id);
        self.isRead = ko.observable(data.isRead);
        self.content = ko.observable(data.content);
        self.url = ko.observable(data.url);
        self.type = ko.observable(data.type);
        self.date = ko.observable(data.date);
        self.activated = ko.observable(data.activated);

        self.isAlert = ko.computed(function () {
            return self.type() === 'alert';
        });
        self.isInfo = ko.computed(function () {
            return self.type() === 'info';
        });
        self.markAsRead = function() {
            _private.RMI("mark_as_read", {id: self.id()});
            self.isRead(true);
            return true;
        };
    };

    var NotificationsServiceModel = function () {
        var self = this;
        self.notifications = ko.observableArray();
        self.hasError = ko.observable(false);
        self.lastSeenNotificationDate = ko.observable();

        self.hasUnread = ko.computed(function () {
            return _.some(self.notifications(), function(note) {
                return !note.isRead();
            });
        });

        self.seen = ko.computed(function() {

            if (!self.hasUnread()) {
                return true;
            }

            var notifications = self.notifications();
            if (notifications.length === 0) {
                return true;
            }

            var newestNotification = notifications[0];
            var newestNotificationDate = new Date(newestNotification.activated());
            var lastSeenNotificationDate = new Date(self.lastSeenNotificationDate());
            return lastSeenNotificationDate >= newestNotificationDate;
        });

        self.init = function () {
            _private.RMI("get_notifications", {'did_it_work': true})
                .done(function (data) {
                    self.lastSeenNotificationDate(data.lastSeenNotificationDate);
                    _.each(data.notifications, function (data) {
                        self.notifications.push(new Notification(data));
                    });
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    self.hasError(true);
                });
        };

        self.bellClickHandler = function() {
            if (self.notifications().length === 0) {
                return;
            }

            _private.RMI("save_last_seen", {"notification_id": self.notifications()[0].id()})
                .done(function(data) {
                    self.lastSeenNotificationDate(data.activated);
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown); // eslint-disable-line no-console
                    self.hasError(true);
                });
        };
    };

    module.serviceModel = {};
    module.initService = function(notificationsKoSelector) {
        if ($(notificationsKoSelector).length < 1) {
            return;
        }
        module.serviceModel = new NotificationsServiceModel();
        module.serviceModel.init();
        $(notificationsKoSelector).koApplyBindings(module.serviceModel);
    };

    module.relativelyPositionUINotify = function (uiNotifySelector) {
        var uiNotifyAlerts = $(uiNotifySelector);
        _.each(uiNotifyAlerts, function (elem) {
            var $notify = $(elem),
                $target = $($notify.data('target'));

            $notify.remove();
            $target
                .css('position', 'relative')
                .append($notify);

        });
    };

    module.initUINotify = function (uiNotifySelector) {
        var uiNotifyAlerts = $(uiNotifySelector);
        if (uiNotifyAlerts.length > 0) {
            uiNotifyAlerts.on('closed.bs.alert', function () {
                var notifySlug = $(this).data('slug');
                _private.RMI("dismiss_ui_notify", {
                    "slug": notifySlug,
                });
            });
        }
    };

    return module;
});

/**
 * Document ready handling for pages that use notifications/js/notifications_service.js
 */

define('notifications/js/notifications_service_main', [
    'jquery',
    'hqwebapp/js/initial_page_data',
    'notifications/js/notifications_service',
    'analytix/js/google',
], function (
    $,
    initialPageData,
    notificationsService,
    googleAnalytics
) {
    $(function () {
        var csrfToken = $("#csrfTokenContainer").val();
        notificationsService.setRMI(initialPageData.reverse('notifications_service'), csrfToken);
        notificationsService.initService('#js-settingsmenu-notifications');
        notificationsService.relativelyPositionUINotify('.alert-ui-notify-relative');
        notificationsService.initUINotify('.alert-ui-notify');

        $(document).on('click', '.notification-link', function() {
            googleAnalytics.track.event('Notification', 'Opened Message', this.href);
        });
        googleAnalytics.track.click($('#notification-icon'), 'Notification', 'Clicked Bell Icon');
    });
});

/* global Appcues, Array, window */

/**
 * Instantiates the AppCues analytics and customer support messaging platform.
 */
define('analytix/js/appcues', [
    'underscore',
    'analytix/js/initial',
    'analytix/js/logging',
    'analytix/js/utils',
], function (
    _,
    initialAnalytics,
    logging,
    utils
) {
    'use strict';
    var _get = initialAnalytics.getFn('appcues'),
        _ready = $.Deferred(),
        _logger = logging.getLoggerForApi('Appcues'),
        EVENT_TYPES = {
            FORM_LOADED: "Form is loaded",
            FORM_SAVE: "Saved a form",
            FORM_SUBMIT: "Submitted a form",
            POPPED_OUT_PREVIEW: "Popped out preview",
            QUESTION_CREATE: "Added a question to a form",
        };

    $(function () {
        var apiId = _get('apiId'),
            scriptUrl = "//fast.appcues.com/" + apiId + '.js';

        _logger = logging.getLoggerForApi('Appcues');
        _ready = utils.initApi(_ready, apiId, scriptUrl, _logger, function () {
            identify(_get("username"), {
                firstName: _get("firstName"),
                lastName: _get("lastName"),
                email: _get("username"),
                createdAt: _get("dateCreated"),
                domain: _get("domain"),
                isDimagi: _get("userIsDimagi"),
                instance: _get("instance"),
            });
        });
    });

    function identify(email, properties) {
        var originalArgs = arguments;
        _ready.done(function () {
            _logger.debug.log(originalArgs, 'Identify');
            Appcues.identify(email, properties);
        });
    }

    function trackEvent(label, data) {
        var originalArgs = arguments;
        _ready.done(function () {
            _logger.debug.log(originalArgs, 'RECORD EVENT');
            if (_.isObject(data)) {
                Appcues.track(label, data);
            } else {
                Appcues.track(label);
            }
        });
    }

    function then(successCallback, failureCallback) {
        _ready.then(successCallback, failureCallback);
    }

    return {
        identify: identify,
        trackEvent: trackEvent,
        EVENT_TYPES: EVENT_TYPES,
        then: then,
    };
});

/* globals window */
/**
 * Instatiates the Hubspot analytics platform.
 */
define('analytix/js/hubspot', [
    'underscore',
    'analytix/js/initial',
    'analytix/js/logging',
    'analytix/js/utils',
], function (
    _,
    initialAnalytics,
    logging,
    utils
) {
    'use strict';
    var _get = initialAnalytics.getFn('hubspot'),
        _logger = logging.getLoggerForApi('Hubspot'),
        _ready = $.Deferred();

    var _hsq = window._hsq = window._hsq || [];

    $(function () {
        var apiId = _get('apiId'),
            scriptUrl = '//js.hs-analytics.net/analytics/' + utils.getDateHash() + '/' + apiId + '.js';

        _logger = logging.getLoggerForApi('Hubspot');
        _ready = utils.initApi(_ready, apiId, scriptUrl, _logger);
    });

    /**
     * Sends data to Hubspot to identify the current session.
     * @param {object} data
     */
    var identify = function (data) {
        _ready.done(function() {
            _logger.debug.log(data, "Identify");
            _hsq.push(['identify', data]);
        });
    };

    /**
     * Tracks an event through the Hubspot API
     * @param {string} eventId - The ID of the event. If you created the event in HubSpot, use the numerical ID of the event.
     * @param {integer|float} value - This is an optional argument that can be used to track the revenue of an event.
     */
    var trackEvent = function (eventId, value) {
        var originalArgs = arguments;
        _ready.done(function() {
            _logger.debug.log(_logger.fmt.labelArgs(["Event ID", "Value"], originalArgs), 'Track Event');
            _hsq.push(['trackEvent', {
                id: eventId,
                value: value,
            }]);
        });
    };

    var then = function(successCallback, failureCallback) {
        _ready.then(successCallback, failureCallback);
    };

    return {
        identify: identify,
        then: then,
        trackEvent: trackEvent,
    };
});

/* global Array, window */

/**
 * Instantiates the Drift analytics and customer support messaging platform.
 */
define('analytix/js/drift', [
    'underscore',
    'analytix/js/initial',
    'analytix/js/logging',
    'analytix/js/utils',
    'analytix/js/hubspot',
], function (
    _,
    initialAnalytics,
    logging,
    utils,
    hubspot
) {
    'use strict';
    var _get = initialAnalytics.getFn('drift'),
        _drift = {},
        _logger = logging.getLoggerForApi('Drift'),
        _ready = $.Deferred(); // eslint-disable-line no-unused-vars

    $(function () {
        var apiId = _get('apiId'),
            scriptUrl = "https://js.driftt.com/include/" + utils.getDateHash() + "/" + apiId + '.js';

        _logger = logging.getLoggerForApi('Drift');
        _ready = utils.initApi(_ready, apiId, scriptUrl, _logger, function() {
            _drift = window.driftt = window.drift = window.driftt || [];
            if (!_drift.init && !_drift.invoked ) {
                _drift.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ];
                _drift.factory = function (methodName) {
                    return function() {
                        var methodFn = Array.prototype.slice.call(arguments);
                        methodFn.unshift(methodName);
                        _drift.push(methodFn);
                        return _drift;
                    };
                };
                _.each(_drift.methods, function (methodName) {
                    _drift[methodName] = _drift.factory(methodName);
                });
            }

            _drift.SNIPPET_VERSION = '0.3.1';

            _drift.on('emailCapture',function(e){
                hubspot.identify({email: e.data.email});
                hubspot.trackEvent('Identified via Drift');
            });
        });
    });

    // no methods just yet
    return 1;
});

/* globals _kmq */

var _kmq = window._kmq = _kmq || [];

define('analytix/js/kissmetrix', [
    'underscore',
    'analytix/js/initial',
    'analytix/js/logging',
    'analytix/js/utils',
], function (
    _,
    initialAnalytics,
    logging,
    utils
) {
    'use strict';
    var _get = initialAnalytics.getFn('kissmetrics'),
        _allAbTests = {},
        _logger = logging.getLoggerForApi('Kissmetrics'),
        _ready = $.Deferred();

    window.dataLayer = window.dataLayer || [];

    /**
     * Push data to _kmq by command type.
     * @param {string} commandName
     * @param {object} properties
     * @param {function|undefined} callbackFn - optional
     * @param {string|undefined} eventName - optional
     */
    var _kmqPushCommand = function (commandName, properties, callbackFn, eventName) {
        _ready.done(function() {
            var command, data;
            command = _.compact([commandName, eventName, properties, callbackFn]);
            _kmq.push(command);
            data = {
                event: 'km_' + commandName,
            };
            if (eventName) data.km_event = eventName;
            if (properties) data.km_property = properties;
            window.dataLayer.push(data);
            _logger.verbose.log(command, ['window._kmq.push', 'window.dataLayer.push', '_kmqPushCommand', commandName]);
        }).fail(function() {
            callbackFn();
        });
    };

    $(function () {
        var apiId = _get('apiId'),
            scriptUrls = [
                '//i.kissmetrics.com/i.js',
                '//doug1izaerwt3.cloudfront.net/' + apiId + '.1.js',
            ];

        _logger = logging.getLoggerForApi('Kissmetrics');
        _ready = utils.initApi(_ready, apiId, scriptUrls, _logger, function() {
            // Identify user and HQ instance
            // This needs to happen before any events are sent or any traits are set
            var username = _get('username');
            if (username) {
                identify(username);
                var traits = {
                    'is_dimagi': _get('isDimagi'),
                    'hq_instance': _get('hqInstance'),
                };
                identifyTraits(traits);
            }

            // Initialize Kissmetrics AB Tests
            var abTests = initialAnalytics.getAbTests('kissmetrics');
            _.each(abTests, function (ab, testName) {
                var test = {};
                testName = _.last(testName.split('.'));
                if (_.isObject(ab) && ab.version) {
                    test[ab.name || testName] = ab.version;
                    _logger.debug.log(test, ["AB Test", "New Test: " + testName]);
                    _kmqPushCommand('set', test);
                    _.extend(_allAbTests, test);
                }
            });
        });
    });

    /**
     * Identifies the current user
     * @param {string} identity - A unique ID to identify the session. Typically the user's email address.
     */
    var identify = function (identity) {
        var originalArgs = arguments;
        _ready.done(function() {
            _logger.debug.log(originalArgs, 'Identify');
            _kmqPushCommand('identify', identity);
        });
    };

    /**
     * Sets traits for the current user
     * @param {object} traits - an object of traits
     * @param {function} callbackFn - (optional) callback function
     * @param {integer} timeout - (optional) timeout in milliseconds
     */
    var identifyTraits = function (traits, callbackFn, timeout) {
        var originalArgs = arguments;
        _ready.done(function() {
            _logger.debug.log(_logger.fmt.labelArgs(["Traits", "Callback Function", "Timeout"], originalArgs), 'Identify Traits (Set)');
            callbackFn = utils.createSafeCallback(callbackFn, timeout);
            _kmqPushCommand('set', traits, callbackFn);
        }).fail(function() {
            if (_.isFunction(callbackFn)) {
                callbackFn();
            }
        });
    };

    /**
     * Records an event and its properties
     * @param {string} name - Name of event to be tracked
     * @param {object} properties - (optional) Properties related to the event being tracked
     * @param {function} callbackFn - (optional) Function to be called after the event is tracked.
     * @param {integer} timeout - (optional) Timeout for safe callback
     */
    var trackEvent = function (name, properties, callbackFn, timeout) {
        var originalArgs = arguments;
        _ready.done(function() {
            _logger.debug.log(originalArgs, 'RECORD EVENT');
            callbackFn = utils.createSafeCallback(callbackFn, timeout);
            _kmqPushCommand('record', properties, callbackFn, name);
        }).fail(function() {
            if (_.isFunction(callbackFn)) {
                callbackFn();
            }
        });
    };

    /**
     * Tags an HTML element to record an event when its clicked
     * @param {string} selector - The ID or class of the element to track.
     * @param {string} name - The name of the event to record.
     * @param {object} properties - optional Properties related to the event being recorded.
     */
    var internalClick = function (selector, name, properties) {
        var originalArgs = arguments;
        _ready.done(function() {
            _logger.debug.log(_logger.fmt.labelArgs(["Selector", "Name", "Properties"], originalArgs), 'Track Internal Click');
            _kmqPushCommand('trackClick', properties, undefined, name);
        });
    };

    /**
     * Tags a link that takes someone to another domain and provides enough time to record an event when the link is clicked, before being redirected.
     * @param {string} selector - The ID or class of the element to track.
     * @param {string} name - The name of the event to record.
     * @param {object} properties - optional Properties related to the event being recorded.
     */
    var trackOutboundLink = function (selector, name, properties) {
        var originalArgs = arguments;
        _ready.done(function() {
            _logger.debug.log(_logger.fmt.labelArgs(["Selector", "Name", "Properties"], originalArgs), 'Track Click on Outbound Link');
            _kmqPushCommand('trackClickOnOutboundLink', properties, undefined, name);
        });
    };

    /**
     * Fetches value for a given AB Test.
     * @param testSlug
     * @returns {*|{}}
     */
    var getAbTest = function (testSlug) {
        return _allAbTests[testSlug];
    };

    /**
     * Run some code once all data and scripts are loaded.
     * @param callback
     * @returns Nothing
     */
    var whenReadyAlways = function(callback) {
        _ready.always(callback);
    };

    return {
        identify: identify,
        identifyTraits: identifyTraits,
        track: {
            event: trackEvent,
            internalClick: internalClick,
            outboundLink: trackOutboundLink,
        },
        getAbTest: getAbTest,
        whenReadyAlways: whenReadyAlways,
    };
});

define('hqwebapp/js/mobile_experience_warning', [
    "jquery",
    "hqwebapp/js/initial_page_data",
    "analytix/js/kissmetrix",
    "jquery.cookie/jquery.cookie",
], function(
    $,
    initialPageData,
    kissmetrix
) {
    $(function() {

        if (initialPageData.get('show_mobile_ux_warning')) {
            var reminderUrl = initialPageData.reverse('send_mobile_reminder'),
                $modal = $("#mobile-experience-modal"),
                $videoModal = $("#mobile-experience-video-modal");

            var setCookie = function () {
                $.cookie(initialPageData.get('mobile_ux_cookie_name'), true, {
                    path: '/',
                });
            };

            $modal.find('.close').click(function (e) {
                e.preventDefault();
                $modal.removeClass('modal-force-show');
                setCookie();
            });

            var sendReminder = function (e) {
                $.ajax({
                    dataType: 'json',
                    url: reminderUrl,
                    type: 'post',
                });
                e.preventDefault();
                $videoModal.modal();
                $videoModal.on('shown.bs.modal', function () {
                    $modal.removeClass('modal-force-show');
                });
                kissmetrix.track.event('Clicked mobile experience reminder');
                setCookie();
            };

            $("#send-mobile-reminder-button").click(sendReminder);
            kissmetrix.track.event('Saw mobile experience warning');
        }

    });
});


define("hqwebapp/js/base_main", function(){});

//# sourceMappingURL=base_main.js.map