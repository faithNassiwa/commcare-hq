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

define('case_importer/js/import_history', [
    'jquery',
    'knockout',
    'underscore',
    'hqwebapp/js/initial_page_data',
    'hqwebapp/js/components.ko',
], function (
    $,
    ko,
    _,
    initialPageData
) {
    var uploadModel = function(options) {
        var self = _.extend({}, _.omit(options, 'comment', 'task_status'));

        self.comment = ko.observable(options.comment || '');
        self.task_status = ko.observable(options.task_status);

        self.commentUrl = function() {
            return initialPageData.reverse('case_importer_update_upload_comment', self.upload_id);
        };

        self.downloadUrl = function() {
            return initialPageData.reverse('case_importer_upload_file_download', self.upload_id);
        };

        return self;
    };

    var recentUploads = function () {
        var self = {};
        // this is used both for the state of the ajax request
        // and for the state of celery task
        self.states = {
            MISSING: -1,
            NOT_STARTED: 0,
            STARTED: 1,
            SUCCESS: 2,
            FAILED: 3,
        };
        self.case_uploads = ko.observableArray(null);
        self.state = ko.observable(self.states.NOT_STARTED);
        var uploadIdsInDataMatchCurrent = function (data) {
            return _.chain(self.case_uploads()).pluck('upload_id').isEqual(_(data).pluck('upload_id')).value();
        };
        var taskStatusesInDataMatchCurrent = function (data) {
            return (
                _.chain(self.case_uploads()).pluck('task_status').map(function (taskStatus) {
                    return taskStatus();
                }).isEqual(_(data).pluck('task_status').map(function (taskStatus) {
                    return taskStatus();
                })).value()
            );
        };
        self.updateCaseUploads = function (data) {
            if (!uploadIdsInDataMatchCurrent(data) || !taskStatusesInDataMatchCurrent(data)) {
                if (uploadIdsInDataMatchCurrent(data)) {
                    // in the easy case, update just the essential information (task_status) in place
                    // this prevents some jumpiness when not necessary
                    // and is particularly bad if you're in the middle of editing a comment
                    _.each(_.zip(self.case_uploads(), data), function (pair) {
                        var caseUpload = pair[0];
                        var newCaseUpload = pair[1];
                        if (caseUpload.upload_id !== newCaseUpload.upload_id) {
                            throw new Error("Somehow even after checking, the case upload lists didn't line up.");
                        }
                        caseUpload.task_status(newCaseUpload.task_status());
                    });
                } else {
                    self.case_uploads(data);
                }
            }
        };
        self.fetchCaseUploads = function () {
            if (self.state() === self.states.NOT_STARTED) {
                // only show spinner on first fetch
                self.state(self.states.STARTED);
            }
            $.get(initialPageData.reverse('case_importer_uploads'), {limit: initialPageData.getUrlParameter('limit')}).done(function (data) {
                self.state(self.states.SUCCESS);
                data = _.map(data, function (caseUpload) {
                    return uploadModel(caseUpload);
                });
                self.updateCaseUploads(data);

                var anyInProgress = _.any(self.case_uploads(), function (caseUpload) {
                    return caseUpload.task_status().state === self.states.STARTED ||
                            caseUpload.task_status().state === self.states.NOT_STARTED;
                });
                if (anyInProgress) {
                    _.delay(self.fetchCaseUploads, 5000);
                }
            }).fail(function () {
                self.state(self.states.FAILED);
            });
        };
        return self;
    };

    return {
        recentUploadsModel: recentUploads,
    };
});

(function() {
  'use strict';
  
  var collator;
  try {
    collator = (typeof Intl !== "undefined" && typeof Intl.Collator !== "undefined") ? Intl.Collator("generic", { sensitivity: "base" }) : null;
  } catch (err){
    console.log("Collator could not be initialized and wouldn't be used");
  }
  // arrays to re-use
  var prevRow = [],
    str2Char = [];
  
  /**
   * Based on the algorithm at http://en.wikipedia.org/wiki/Levenshtein_distance.
   */
  var Levenshtein = {
    /**
     * Calculate levenshtein distance of the two strings.
     *
     * @param str1 String the first string.
     * @param str2 String the second string.
     * @param [options] Additional options.
     * @param [options.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
     * @return Integer the levenshtein distance (0 and above).
     */
    get: function(str1, str2, options) {
      var useCollator = (options && collator && options.useCollator);
      
      var str1Len = str1.length,
        str2Len = str2.length;
      
      // base cases
      if (str1Len === 0) return str2Len;
      if (str2Len === 0) return str1Len;

      // two rows
      var curCol, nextCol, i, j, tmp;

      // initialise previous row
      for (i=0; i<str2Len; ++i) {
        prevRow[i] = i;
        str2Char[i] = str2.charCodeAt(i);
      }
      prevRow[str2Len] = str2Len;

      var strCmp;
      if (useCollator) {
        // calculate current row distance from previous row using collator
        for (i = 0; i < str1Len; ++i) {
          nextCol = i + 1;

          for (j = 0; j < str2Len; ++j) {
            curCol = nextCol;

            // substution
            strCmp = 0 === collator.compare(str1.charAt(i), String.fromCharCode(str2Char[j]));

            nextCol = prevRow[j] + (strCmp ? 0 : 1);

            // insertion
            tmp = curCol + 1;
            if (nextCol > tmp) {
              nextCol = tmp;
            }
            // deletion
            tmp = prevRow[j + 1] + 1;
            if (nextCol > tmp) {
              nextCol = tmp;
            }

            // copy current col value into previous (in preparation for next iteration)
            prevRow[j] = curCol;
          }

          // copy last col value into previous (in preparation for next iteration)
          prevRow[j] = nextCol;
        }
      }
      else {
        // calculate current row distance from previous row without collator
        for (i = 0; i < str1Len; ++i) {
          nextCol = i + 1;

          for (j = 0; j < str2Len; ++j) {
            curCol = nextCol;

            // substution
            strCmp = str1.charCodeAt(i) === str2Char[j];

            nextCol = prevRow[j] + (strCmp ? 0 : 1);

            // insertion
            tmp = curCol + 1;
            if (nextCol > tmp) {
              nextCol = tmp;
            }
            // deletion
            tmp = prevRow[j + 1] + 1;
            if (nextCol > tmp) {
              nextCol = tmp;
            }

            // copy current col value into previous (in preparation for next iteration)
            prevRow[j] = curCol;
          }

          // copy last col value into previous (in preparation for next iteration)
          prevRow[j] = nextCol;
        }
      }
      return nextCol;
    }

  };

  // amd
  if (typeof define !== "undefined" && define !== null && define.amd) {
    define('fast-levenshtein/levenshtein',[],function() {
      return Levenshtein;
    });
  }
  // commonjs
  else if (typeof module !== "undefined" && module !== null && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = Levenshtein;
  }
  // web worker
  else if (typeof self !== "undefined" && typeof self.postMessage === 'function' && typeof self.importScripts === 'function') {
    self.Levenshtein = Levenshtein;
  }
  // browser main thread
  else if (typeof window !== "undefined" && window !== null) {
    window.Levenshtein = Levenshtein;
  }
}());


define('case_importer/js/excel_fields', [
    'jquery',
    'knockout',
    'underscore',
    'fast-levenshtein/levenshtein',
], function (
    $,
    ko,
    _,
    levenshtein
) {
    function excelFieldRows(excelFields, caseFieldSpecs) {
        var self = {
            excelFields: excelFields,
            caseFieldSpecs: caseFieldSpecs,
        };
        self.caseFieldSpecsInMenu = _(caseFieldSpecs).where({show_in_menu: true});

        self.caseFieldsInMenu = _(self.caseFieldSpecsInMenu).pluck('field');
        self.caseFieldSuggestions = _.chain(self.caseFieldSpecs).where({discoverable: true}).pluck('field').value();
        self.mappingRows = ko.observableArray();
        self.removeRow = function (row) {
            self.mappingRows.remove(row);
        };
        self.addRow = function (excelField) {
            var row = {
                excelField: ko.observable(excelField),
                selectedCaseField: ko.observable(null),
                customCaseField: ko.observable(excelField),
                isCustom: ko.observable(false),
            };
            row.selectedCaseFieldOrBlank = ko.computed({
                read: function () {
                    return row.isCustom() ? '' : row.selectedCaseField();
                },
                write: row.selectedCaseField,
            });
            row.customCaseFieldOrBlank = ko.computed({
                read: function () {
                    return row.isCustom() ? row.customCaseField() : '';
                },
                write: row.customCaseField,
            });

            row.caseField = ko.computed(function () {
                if (row.isCustom()) {
                    return row.customCaseField();
                } else {
                    return row.selectedCaseField();
                }
            });

            row.caseFieldSpec = ko.computed(function () {
                return _(caseFieldSpecs).findWhere({field: row.caseField()}) || {};
            });
            row.hasDiscoverableSpecialField = ko.computed(function () {
                return row.caseFieldSpec().description && row.caseFieldSpec().discoverable;
            });
            row.hasNonDiscoverableField = ko.computed(function () {
                return row.caseFieldSpec().description && !row.caseFieldSpec().discoverable;
            });
            row.reset = function () {
                var field = row.excelField();
                field = field && sanitizeCaseField(field);
                row.customCaseField(field);
                if (!field || _(self.caseFieldsInMenu).contains(field)) {
                    row.isCustom(false);
                    row.selectedCaseField(field);
                } else {
                    row.isCustom(true);
                    row.selectedCaseField(null);
                }
            };
            row.reset();
            row.caseFieldSuggestions = ko.computed(function () {
                var field = row.caseField();
                if (!field || _(self.caseFieldSuggestions).contains(field)) {
                    return [];
                }
                var suggestions = _(self.caseFieldSuggestions).map(function (suggestion) {
                    return {
                        // make distance case-insensitive
                        distance: levenshtein.get(field.toLowerCase(), suggestion.toLowerCase()),
                        field: suggestion,
                    };
                }).filter(function (suggestion) {
                    return suggestion.distance < 4;
                });
                return _.chain(suggestions).sortBy('distance').pluck('field').value();
            });

            self.mappingRows.push(row);
        };
        self.autoFill = function () {
            _(self.mappingRows()).each(function (row) {
                row.reset();
            });
        };

        // initialize mappingRows with one row per excelField
        _.each(excelFields, self.addRow);

        return self;
    }

    var sanitizeCaseField = function (originalValue) {
        var value = originalValue;
        // space to underscore
        value = value.replace(/\s/g, "_");
        // remove other symbols
        value = value.replace(/[^a-zA-Z0-9_\-]/g, "");  // eslint-disable-line no-useless-escape
        // remove xml from beginning of string, which would be an invalid xml identifier
        value = value.replace(/^xml/i, "");
        return value;
    };

    return {
        excelFieldRowsModel: excelFieldRows,
        sanitizeCaseField: sanitizeCaseField,
    };
});

define("case_importer/js/main", [
    'jquery',
    'underscore',
    'hqwebapp/js/initial_page_data',
    'case_importer/js/import_history',
    'case_importer/js/excel_fields',
], function(
    $,
    _,
    initialPageData,
    importHistory,
    excelFieldsModule
) {
    var behaviorForUploadPage = function() {
        var $recentUploads = $('#recent-uploads');
        if (!$recentUploads.length) {
            // We're not on the upload page
            return;
        }

        var recentUploads = importHistory.recentUploadsModel();
        $('#recent-uploads').koApplyBindings(recentUploads);
        _.delay(recentUploads.fetchCaseUploads);
    };

    var behaviorForExcelMappingPage = function() {
        var excelFields = initialPageData.get('excel_fields');
        var caseFieldSpecs = initialPageData.get('case_field_specs');
        if (!excelFields && !caseFieldSpecs) {
            // We're not on the excel mapping page
            return;
        }

        var excelFieldRows = excelFieldsModule.excelFieldRowsModel(excelFields, caseFieldSpecs);
        $('#excel-field-rows').koApplyBindings(excelFieldRows);

        $('#js-add-mapping').click(function(e) {
            excelFieldRows.addRow();
            e.preventDefault();
        });

        $('.custom_field').on('change, keypress, keydown, keyup', function() {
            var originalValue = $(this).val();
            var value = excelFieldsModule.sanitizeCaseField(originalValue);
            if (value !== originalValue) {
                $(this).val(value);
            }
        });

        $('#field_form').submit(function() {
            $('[disabled]').each(function() {
                $(this).prop('disabled', false);
            });

            return true;
        });

        $('#autofill').click(function() {
            excelFieldRows.autoFill();
        });
    };

    $(function () {
        $('#back_button').click(function() {
            history.back();
            return false;
        });

        $('#back_breadcrumb').click(function(e) {
            e.preventDefault();
            history.back();
            return false;
        });

        behaviorForUploadPage();
        behaviorForExcelMappingPage();
    });
});


define("case_importer/js/bundle", function(){});

//# sourceMappingURL=bundle.js.map