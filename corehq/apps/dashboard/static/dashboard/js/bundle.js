(function(e){"use strict";var t=typeof window==="undefined"?null:window;if(typeof define==="function"&&define.amd){define('DOMPurify/dist/purify.min',[],function(){return e(t)})}else if(typeof module!=="undefined"){module.exports=e(t)}else{t.DOMPurify=e(t)}})(function e(t){"use strict";var r=function(t){return e(t)};r.version="0.8.3";r.removed=[];if(!t||!t.document||t.document.nodeType!==9){r.isSupported=false;return r}var n=t.document;var a=n;var i=t.DocumentFragment;var o=t.HTMLTemplateElement;var l=t.NodeFilter;var s=t.NamedNodeMap||t.MozNamedAttrMap;var f=t.Text;var c=t.Comment;var u=t.DOMParser;if(typeof o==="function"){var d=n.createElement("template");if(d.content&&d.content.ownerDocument){n=d.content.ownerDocument}}var m=n.implementation;var p=n.createNodeIterator;var v=n.getElementsByTagName;var h=n.createDocumentFragment;var g=a.importNode;var y={};r.isSupported=typeof m.createHTMLDocument!=="undefined"&&n.documentMode!==9;var b=function(e,t){var r=t.length;while(r--){if(typeof t[r]==="string"){t[r]=t[r].toLowerCase()}e[t[r]]=true}return e};var T=function(e){var t={};var r;for(r in e){if(e.hasOwnProperty(r)){t[r]=e[r]}}return t};var x=null;var k=b({},["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr","svg","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","switch","symbol","text","textpath","title","tref","tspan","view","vkern","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feMerge","feMergeNode","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmuliscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mpspace","msqrt","mystyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","#text"]);var A=null;var w=b({},["accept","action","align","alt","autocomplete","background","bgcolor","border","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","coords","datetime","default","dir","disabled","download","enctype","face","for","headers","height","hidden","high","href","hreflang","id","ismap","label","lang","list","loop","low","max","maxlength","media","method","min","multiple","name","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","rows","rowspan","spellcheck","scope","selected","shape","size","span","srclang","start","src","step","style","summary","tabindex","title","type","usemap","valign","value","width","xmlns","accent-height","accumulate","additivive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mode","min","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","surfacescale","targetx","targety","transform","text-anchor","text-decoration","text-rendering","textlength","u1","u2","unicode","values","viewbox","visibility","vert-adv-y","vert-origin-x","vert-origin-y","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","y","y1","y2","z","zoomandpan","accent","accentunder","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","display","displaystyle","fence","frame","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]);var E=null;var S=null;var M=true;var O=false;var N=false;var L=false;var D=/\{\{[\s\S]*|[\s\S]*\}\}/gm;var _=/<%[\s\S]*|[\s\S]*%>/gm;var C=false;var z=false;var R=false;var F=false;var H=true;var B=true;var W=b({},["audio","head","math","script","style","svg","video"]);var j=b({},["audio","video","img","source"]);var G=b({},["alt","class","for","id","label","name","pattern","placeholder","summary","title","value","style","xmlns"]);var I=null;var q=n.createElement("form");var P=function(e){if(typeof e!=="object"){e={}}x="ALLOWED_TAGS"in e?b({},e.ALLOWED_TAGS):k;A="ALLOWED_ATTR"in e?b({},e.ALLOWED_ATTR):w;E="FORBID_TAGS"in e?b({},e.FORBID_TAGS):{};S="FORBID_ATTR"in e?b({},e.FORBID_ATTR):{};M=e.ALLOW_DATA_ATTR!==false;O=e.ALLOW_UNKNOWN_PROTOCOLS||false;N=e.SAFE_FOR_JQUERY||false;L=e.SAFE_FOR_TEMPLATES||false;C=e.WHOLE_DOCUMENT||false;z=e.RETURN_DOM||false;R=e.RETURN_DOM_FRAGMENT||false;F=e.RETURN_DOM_IMPORT||false;H=e.SANITIZE_DOM!==false;B=e.KEEP_CONTENT!==false;if(L){M=false}if(R){z=true}if(e.ADD_TAGS){if(x===k){x=T(x)}b(x,e.ADD_TAGS)}if(e.ADD_ATTR){if(A===w){A=T(A)}b(A,e.ADD_ATTR)}if(B){x["#text"]=true}if(Object&&"freeze"in Object){Object.freeze(e)}I=e};var U=function(e){r.removed.push({element:e});try{e.parentNode.removeChild(e)}catch(t){e.outerHTML=""}};var V=function(e,t){r.removed.push({attribute:t.getAttributeNode(e),from:t});t.removeAttribute(e)};var K=function(e){var t,r;try{t=(new u).parseFromString(e,"text/html")}catch(n){}if(!t||!t.documentElement){t=m.createHTMLDocument("");r=t.body;r.parentNode.removeChild(r.parentNode.firstElementChild);r.outerHTML=e}if(typeof t.getElementsByTagName==="function"){return t.getElementsByTagName(C?"html":"body")[0]}return v.call(t,C?"html":"body")[0]};var J=function(e){return p.call(e.ownerDocument||e,e,l.SHOW_ELEMENT|l.SHOW_COMMENT|l.SHOW_TEXT,function(){return l.FILTER_ACCEPT},false)};var Q=function(e){if(e instanceof f||e instanceof c){return false}if(typeof e.nodeName!=="string"||typeof e.textContent!=="string"||typeof e.removeChild!=="function"||!(e.attributes instanceof s)||typeof e.removeAttribute!=="function"||typeof e.setAttribute!=="function"){return true}return false};var X=function(e){var t,n;ne("beforeSanitizeElements",e,null);if(Q(e)){U(e);return true}t=e.nodeName.toLowerCase();ne("uponSanitizeElement",e,{tagName:t});if(!x[t]||E[t]){if(B&&!W[t]&&typeof e.insertAdjacentHTML==="function"){try{e.insertAdjacentHTML("AfterEnd",e.innerHTML)}catch(a){}}U(e);return true}if(N&&!e.firstElementChild&&(!e.content||!e.content.firstElementChild)&&/</g.test(e.textContent)){r.removed.push({element:e.cloneNode()});e.innerHTML=e.textContent.replace(/</g,"&lt;")}if(L&&e.nodeType===3){n=e.textContent;n=n.replace(D," ");n=n.replace(_," ");if(e.textContent!==n){r.removed.push({element:e.cloneNode()});e.textContent=n}}ne("afterSanitizeElements",e,null);return false};var Y=/^data-[\-\w.\u00B7-\uFFFF]/;var Z=/^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;var $=/^(?:\w+script|data):/i;var ee=/[\x00-\x20\xA0\u1680\u180E\u2000-\u2029\u205f\u3000]/g;var te=function(e){var a,i,o,l,s,f,c,u;ne("beforeSanitizeAttributes",e,null);f=e.attributes;if(!f){return}c={attrName:"",attrValue:"",keepAttr:true};u=f.length;while(u--){a=f[u];i=a.name;o=a.value;l=i.toLowerCase();c.attrName=l;c.attrValue=o;c.keepAttr=true;ne("uponSanitizeAttribute",e,c);o=c.attrValue;if(l==="name"&&e.nodeName==="IMG"&&f.id){s=f.id;f=Array.prototype.slice.apply(f);V("id",e);V(i,e);if(f.indexOf(s)>u){e.setAttribute("id",s.value)}}else{if(i==="id"){e.setAttribute(i,"")}V(i,e)}if(!c.keepAttr){continue}if(H&&(l==="id"||l==="name")&&(o in t||o in n||o in q)){continue}if(L){o=o.replace(D," ");o=o.replace(_," ")}if(M&&Y.test(l)){}else if(!A[l]||S[l]){continue}else if(G[l]){}else if(Z.test(o.replace(ee,""))){}else if(l==="src"&&o.indexOf("data:")===0&&j[e.nodeName.toLowerCase()]){}else if(O&&!$.test(o.replace(ee,""))){}else if(!o){}else{continue}try{e.setAttribute(i,o);r.removed.pop()}catch(d){}}ne("afterSanitizeAttributes",e,null)};var re=function(e){var t;var r=J(e);ne("beforeSanitizeShadowDOM",e,null);while(t=r.nextNode()){ne("uponSanitizeShadowNode",t,null);if(X(t)){continue}if(t.content instanceof i){re(t.content)}te(t)}ne("afterSanitizeShadowDOM",e,null)};var ne=function(e,t,n){if(!y[e]){return}y[e].forEach(function(e){e.call(r,t,n,I)})};r.sanitize=function(e,n){var o,l,s,f,c;if(!e){e=""}if(typeof e!=="string"){if(typeof e.toString!=="function"){throw new TypeError("toString is not a function")}else{e=e.toString()}}if(!r.isSupported){if(typeof t.toStaticHTML==="object"||typeof t.toStaticHTML==="function"){return t.toStaticHTML(e)}return e}P(n);r.removed=[];if(!z&&!C&&e.indexOf("<")===-1){return e}o=K(e);if(!o){return z?null:""}f=J(o);while(l=f.nextNode()){if(l.nodeType===3&&l===s){continue}if(X(l)){continue}if(l.content instanceof i){re(l.content)}te(l);s=l}if(z){if(R){c=h.call(o.ownerDocument);while(o.firstChild){c.appendChild(o.firstChild)}}else{c=o}if(F){c=g.call(a,c,true)}return c}return C?o.outerHTML:o.innerHTML};r.addHook=function(e,t){if(typeof t!=="function"){return}y[e]=y[e]||[];y[e].push(t)};r.removeHook=function(e){if(y[e]){y[e].pop()}};r.removeHooks=function(e){if(y[e]){y[e]=[]}};r.removeAllHooks=function(){y={}};return r});
//# sourceMappingURL=./dist/purify.min.js.map;
/*
 * Component for an inline editing widget: a piece of text that, when clicked on, turns into an input (textarea or
 * text input). The input is accompanied by a save button capable of saving the new value to the server via ajax.
 *
 * Optional parameters
 *  - url: The URL to call on save. If none is given, no ajax call will be made
 *  - value: Text to display and edit
 *  - name: HTML name of input
 *  - id: HTML id of input
 *  - placeholder: Text to display when in read-only mode if value is blank
 *  - lang: Display this language code in a badge next to the widget.
 *  - nodeName: 'textarea' or 'input'. Defaults to 'textarea'.
 *  - rows: Number of rows in input.
 *  - cols: Number of cols in input.
 *  - saveValueName: Name to associate with text value when saving. Defaults to 'value'.
 *  - saveParams: Any additional data to pass along. May contain observables.
 *  - errorMessage: Message to display if server returns an error.
 */

define('hqwebapp/js/components/inline_edit', [
    'jquery',
    'knockout',
    'underscore',
    'DOMPurify/dist/purify.min',
], function(
    $,
    ko,
    _,
    DOMPurify
) {
    return {
        viewModel: function(params) {
            var self = this;

            // Attributes passed on to the input
            self.name = params.name || '';
            self.id = params.id || '';

            // Data
            self.placeholder = params.placeholder || '';
            self.readOnlyValue = (ko.isObservable(params.value) ? params.value() : params.value) || '';
            self.serverValue = self.readOnlyValue;
            self.value = ko.isObservable(params.value) ? params.value : ko.observable(self.readOnlyValue);
            self.lang = params.lang || '';

            // Styling
            self.nodeName = params.nodeName || 'textarea';
            self.rows = params.rows || 2;
            self.cols = params.cols || "";
            self.readOnlyClass = params.readOnlyClass || '';
            self.readOnlyAttrs = params.readOnlyAttrs || {};
            self.iconClass = ko.observable(params.iconClass);
            self.containerClass = params.containerClass || '';

            // Interaction: determine whether widget is in read or write mode
            self.isEditing = ko.observable(false);
            self.saveHasFocus = ko.observable(false);
            self.cancelHasFocus = ko.observable(false);
            self.afterRenderFunc = params.afterRenderFunc;

            // Save to server
            self.url = params.url;
            self.errorMessage = params.errorMessage || gettext("Error saving, please try again.");
            self.saveParams = ko.utils.unwrapObservable(params.saveParams) || {};
            self.saveValueName = params.saveValueName || 'value';
            self.hasError = ko.observable(false);
            self.isSaving = ko.observable(false);
            self.postSave = params.postSave;

            // On edit, set editing mode, which controls visibility of inner components
            self.edit = function() {
                self.isEditing(true);
            };

            self.beforeUnload = function() {
                return gettext("You have unsaved changes.");
            };

            // Save to server
            // On button press, flip back to read-only mode and show a spinner.
            // On server success, just hide the spinner. On error, display error and go back to edit mode.
            self.save = function() {
                self.isEditing(false);

                if (self.url) {
                    // Nothing changed
                    if (self.readOnlyValue === self.value() && self.serverValue === self.value()) {
                        return;
                    }

                    // Strip HTML and then undo DOMPurify's HTML escaping
                    self.value($("<div/>").html(DOMPurify.sanitize(self.value())).text());
                    self.readOnlyValue = self.value();

                    var data = self.saveParams;
                    _.each(data, function (value, key) {
                        data[key] = ko.utils.unwrapObservable(value);
                    });
                    data[self.saveValueName] = self.value();
                    self.isSaving(true);
                    $(window).on("beforeunload", self.beforeUnload);

                    $.ajax({
                        url: self.url,
                        type: 'POST',
                        dataType: 'JSON',
                        data: data,
                        success: function (data) {
                            self.isSaving(false);
                            self.hasError(false);
                            self.serverValue = self.readOnlyValue;
                            if (self.postSave) {
                                self.postSave(data);
                            }
                            $(window).off("beforeunload", self.beforeUnload);
                        },
                        error: function () {
                            self.isEditing(true);
                            self.isSaving(false);
                            self.hasError(true);
                            $(window).off("beforeunload", self.beforeUnload);
                        },
                    });
                }
            };

            // Revert to last value and switch modes
            self.cancel = function() {
                self.readOnlyValue = self.serverValue;
                self.value(self.readOnlyValue);
                self.isEditing(false);
                self.hasError(false);
            };
        },
        template: '<div data-bind="template: { name: \'ko-inline-edit-template\' }"></div>'
    };
});

// Knockout Pagination Component
// Include the <pagination> element on on your knockout page with the following parameters:
// goToPage(page): a function that updates your view with new items for the given page.
// perPage: a knockout observable that holds the number of items per page. This will be updated when the user changes the number of items using the dropdown. This should be used in your `goToPage` function to return the correct number of items.
// totalItems: a knockout observable that returns the total number of items
// See releases_table.html for an example.
// This component must be nested within another element that has had knockout bindings applied to it.

define('hqwebapp/js/components/pagination', [
    'knockout',
    'underscore',
], function(
    ko,
    _
) {
    return {
        viewModel: function(params){
            var self = {};

            self.currentPage = ko.observable(params.currentPage || 1);
            self.totalItems = params.totalItems;
            self.totalItems.subscribe(function(newValue) {
                self.goToPage(1);
            });
            self.perPage = ko.isObservable(params.perPage) ? params.perPage : ko.observable(params.perPage);
            self.numPages = ko.computed(function(){
                return Math.ceil(self.totalItems() / self.perPage());
            });
            self.perPage.subscribe(function(){
                self.goToPage(1);
            });
            self.inlinePageListOnly = !!params.inlinePageListOnly;
            self.maxPagesShown = params.maxPagesShown || 9;

            self.nextPage = function(){
                self.goToPage(Math.min(self.currentPage() + 1, self.numPages()));
            };
            self.previousPage = function(){
                self.goToPage(Math.max(self.currentPage() - 1, 1));
            };
            self.goToPage = function(page){
                self.currentPage(page);
                params.goToPage(self.currentPage());
            };
            self.itemsShowing = ko.computed(function(){
                return self.currentPage() * self.perPage();
            });
            self.itemsText = ko.computed(function(){
                var lastItem = Math.min(self.currentPage() * self.perPage(), self.totalItems());
                return _.template(
                    gettext('Showing <%= firstItem %> to <%= lastItem %> of <%= maxItems %> entries')
                )({
                    firstItem: ((self.currentPage() - 1) * self.perPage()) + 1,
                    lastItem: isNaN(lastItem) ? 1 : lastItem,
                    maxItems: self.totalItems(),
                });
            });
            self.pagesShown = ko.computed(function(){
                var pages = [];
                for (var pageNum = 1; pageNum <= self.numPages(); pageNum++){
                    var midPoint = Math.floor(self.maxPagesShown / 2),
                        leftHalf = pageNum >= self.currentPage() - midPoint,
                        rightHalf = pageNum <= self.currentPage() + midPoint,
                        pageVisible = (leftHalf && rightHalf) || pages.length < self.maxPagesShown && pages[pages.length - 1] > self.currentPage();
                    if (pageVisible){
                        pages.push(pageNum);
                    }
                }
                return pages;
            });
            return self;
        },
        template: '<div data-bind="template: { name: \'ko-pagination-template\' }"></div>',
    };
});

define("hqwebapp/js/components.ko", [
    'jquery',
    'knockout',
    'underscore',
    'hqwebapp/js/components/inline_edit',
    'hqwebapp/js/components/pagination',
], function(
    $,
    ko,
    _,
    inlineEdit,
    pagination
) {
    var components = {
        'inline-edit': inlineEdit,
        'pagination': pagination,
    };

    _.each(components, function(moduleName, elementName) {
        ko.components.register(elementName, moduleName);
    });

    $(function() {
        _.each(_.keys(components), function(elementName) {
            _.each($(elementName), function(el) {
                var $el = $(el);
                if (!($el.data('apply-bindings') === false)) {
                    $(el).koApplyBindings();
                }
            });
        });
    });
});

define("dashboard/js/dashboard", [
    'jquery',
    'knockout',
    'underscore',
    'hqwebapp/js/initial_page_data',
    'hqwebapp/js/components.ko',    // pagination widget
    'hqwebapp/js/main',     // post-link function
], function(
    $,
    ko,
    _,
    initialPageData
) {
    var tileModel = function(options) {
        var self = {};
        self.title = options.title;
        self.slug = options.slug;
        self.icon = options.icon;
        self.url = options.url;
        self.helpText = options.help_text;
        self.hasError = ko.observable(false);

        // Might get updated if this tile supports an item list but it's empty
        self.hasItemList = ko.observable(options.has_item_list);

        if (self.hasItemList()) {
            self.itemsPerPage = 5;

            // Set via ajax
            self.totalItems = ko.observable();
            self.totalPages = ko.observable();
            self.items = ko.observableArray();
        }

        // Control visibility of various parts of tile content
        self.showBackgroundIcon = ko.computed(function() {
            return self.hasItemList() && !self.hasError();
        });
        self.showSpinner = ko.computed(function() {
            // Show spinner if this is an ajax tile, it's still waiting for one or both requests,
            // and neither request has errored out
            return self.hasItemList()
                   && (self.items().length === 0 || self.totalPages() === undefined)
                   && !self.hasError();
        });
        self.showItemList = ko.computed(function() {
            return !self.showSpinner() && !self.hasError();
        });
        self.showIconLink = ko.computed(function() {
            return !self.hasItemList() || self.hasError();
        });

        // Paging
        if (self.hasItemList()) {
            self.goToPage = function(page) {
                // If request takes a noticeable amount of time, clear items, which will show spinner
                var done = false;
                _.delay(function() {
                    if (!done) {
                        self.items([]);     // clear items to show spinner
                    }
                }, 500);

                // Send request for items on current page
                var itemRequest = $.ajax({
                    method: "GET",
                    url: initialPageData.reverse('dashboard_tile', self.slug),
                    data: {
                        itemsPerPage: self.itemsPerPage,
                        currentPage: page,
                    },
                    success: function(data) {
                        self.items(data.items);
                        done = true;
                    },
                    error: function() {
                        self.hasError(true);
                    },
                });

                // Total number of pages is also a separate request, but it only needs to run once
                // and then self.totalPages() never changes again
                if (self.totalItems() === undefined) {
                    var totalPagesRequest = $.ajax({
                        method: "GET",
                        url: initialPageData.reverse('dashboard_tile_total', self.slug),
                        success: function(data) {
                            self.totalItems(data.total);
                            self.totalPages(Math.ceil(data.total / self.itemsPerPage) );
                            if (data.total === 0) {
                                self.hasItemList(false);
                            }
                        },
                        error: function() {
                            self.hasError(true);
                        },
                    });
                }
            };

            // Initialize with first page of data
            self.goToPage(1);
        }

        return self;
    };

    var dashboardModel = function(options) {
        var self = {};
        self.tiles = _.map(options.tiles, function(t) { return tileModel(t); });
        return self;
    };

    $(function() {
        $("#dashboard-tiles").koApplyBindings(dashboardModel({
            tiles: initialPageData.get("dashboard_tiles"),
        }));
    });
});


define("dashboard/js/bundle", function(){});

//# sourceMappingURL=bundle.js.map