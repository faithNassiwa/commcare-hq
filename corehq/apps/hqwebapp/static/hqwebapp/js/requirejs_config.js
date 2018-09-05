/* globals requirejs */
requirejs.config({
    baseUrl: '/static/',
    paths: {
        jquery: 'jquery/dist/jquery.min',
        underscore: 'underscore/underscore',
        bootstrap: 'bootstrap/dist/js/bootstrap.min',
        knockout: 'knockout/dist/knockout.debug',
        'ko.mapping': 'hqwebapp/js/lib/knockout_plugins/knockout_mapping.ko.min',
        datatables: 'datatables/media/js/jquery.dataTables.min',
        'datatables.fixedColumns': 'datatables-fixedcolumns/js/dataTables.fixedColumns',
        'datatables.bootstrap': 'datatables-bootstrap3/BS3/assets/js/datatables'
    },
    shim: {
        bootstrap: {
            deps: [
                'jquery'
            ]
        },
        'ko.mapping': {
            deps: [
                'knockout'
            ]
        },
        'hqwebapp/js/hq.helpers': {
            deps: [
                'jquery',
                'bootstrap',
                'knockout',
                'underscore'
            ]
        },
        'datatables.bootstrap': {
            deps: [
                'datatables'
            ]
        },
        'jquery.rmi/jquery.rmi': {
            deps: [
                'jquery',
                'knockout',
                'underscore'
            ],
            exports: 'RMI'
        },
        'ace-builds/src-min-noconflict/ace': {
            exports: 'ace'
        }
    },
    map: {
        'datatables.fixedColumns': {
            'datatables.net': 'datatables'
        }
    },
    onBuildRead: function (moduleName, path, contents) {
    return contents.replace(/hqDefine/g, 'define');
},
    bundles: {
        'hqwebapp/js/common': [
            'jquery',
            'knockout',
            'ko.mapping',
            'underscore',
            'bootstrap',
            'hqwebapp/js/django'
        ],
        'hqwebapp/js/base_main': [
            'hqwebapp/js/initial_page_data',
            'analytix/js/initial',
            'analytix/js/logging',
            'analytix/js/utils',
            'analytix/js/google',
            'hqwebapp/js/hq.helpers',
            'hqwebapp/js/layout',
            'jquery-form/dist/jquery.form.min',
            'hqwebapp/js/hq-bug-report',
            'hqwebapp/js/sticky_tabs',
            'hqwebapp/js/alert_user',
            'hqwebapp/js/hq_extensions.jquery',
            'jquery.cookie/jquery.cookie',
            'hqwebapp/js/main',
            'jquery.rmi/jquery.rmi',
            'notifications/js/notifications_service',
            'notifications/js/notifications_service_main',
            'analytix/js/appcues',
            'analytix/js/hubspot',
            'analytix/js/drift',
            'analytix/js/kissmetrix',
            'hqwebapp/js/mobile_experience_warning'
        ],
        'hqpillow_retry/js/bundle': [
            'hqpillow_retry/js/single'
        ],
        'reminders/js/bundle': [
            'reminders/js/reminders.keywords.ko'
        ],
        'repeaters/js/bundle': [
            'select2-3.5.2-legacy/select2',
            'hqwebapp/js/widgets',
            'locations/js/widgets_main',
            'repeaters/js/add_form_repeater'
        ],
        'case_importer/js/bundle': [
            'DOMPurify/dist/purify.min',
            'hqwebapp/js/components/inline_edit',
            'hqwebapp/js/components/pagination',
            'hqwebapp/js/components.ko',
            'case_importer/js/import_history',
            'fast-levenshtein/levenshtein',
            'case_importer/js/excel_fields',
            'case_importer/js/main'
        ],
        'accounting/js/bundle': [
            'select2-3.5.2-legacy/select2',
            'accounting/js/widgets',
            'accounting/js/invoice_main',
            'accounting/js/enterprise_dashboard',
            'accounting/js/credits_tab',
            'accounting/js/billing_account_form',
            'jquery-ui/ui/core',
            'jquery-ui/ui/datepicker',
            'accounting/js/base_subscriptions_main',
            'hqwebapp/js/assert_properties',
            'accounting/js/enterprise_settings',
            'bootstrap-timepicker/js/bootstrap-timepicker',
            'hqwebapp/js/select2_handler',
            'multiselect/js/jquery.multi-select',
            'quicksearch/dist/jquery.quicksearch.min',
            'hqwebapp/js/multiselect_utils',
            'accounting/js/software_plan_version_handler',
            'accounting/js/subscriptions_main'
        ],
        'dhis2/js/bundle': [
            'dhis2/js/dhis2_map_settings'
        ],
        'data_dictionary/js/bundle': [
            'jquery-ui/ui/core',
            'jquery-ui/ui/widget',
            'jquery-ui/ui/mouse',
            'jquery-ui/ui/sortable',
            'hqwebapp/js/knockout_bindings.ko',
            'data_dictionary/js/data_dictionary'
        ],
        'dashboard/js/bundle': [
            'DOMPurify/dist/purify.min',
            'hqwebapp/js/components/inline_edit',
            'hqwebapp/js/components/pagination',
            'hqwebapp/js/components.ko',
            'dashboard/js/dashboard'
        ],
        'openmrs/js/bundle': [
            'userreports/js/base',
            'openmrs/js/openmrs_importers'
        ],
        'case_search/js/bundle': [
            'case_search/js/case_search'
        ],
        'builds/js/bundle': [
            'jquery-ui/ui/core',
            'jquery-ui/ui/widget',
            'jquery-ui/ui/mouse',
            'jquery-ui/ui/sortable',
            'hqwebapp/js/knockout_bindings.ko',
            'builds/js/edit-builds'
        ],
        'commtrack/js/bundle': [
            'commtrack/js/stock_levels'
        ],
        'export/js/bundle': [
            'hqwebapp/js/assert_properties',
            'export/js/download_data_files'
        ],
        'fixtures/js/bundle': [
            'jquery-ui/ui/core',
            'jquery-ui/ui/widget',
            'jquery-ui/ui/mouse',
            'jquery-ui/ui/sortable',
            'hqwebapp/js/knockout_bindings.ko',
            'fixtures/js/lookup-manage',
            'reports/js/standard_hq_report',
            'datatables',
            'datatables.bootstrap',
            'reports/js/config.dataTables.bootstrap',
            'select2-3.5.2-legacy/select2',
            'reports/js/filters/select2s',
            'reports/js/filters/phone_number',
            'reports/js/filters/button_group',
            'reports/js/filters/schedule_instance',
            'locations/js/location_drilldown',
            'reports/js/filters/advanced_forms_options',
            'reports/js/filters/drilldown_options',
            'reports_core/js/choice_list_utils',
            'reports/js/filters/case_list_explorer',
            'hqwebapp/js/atwho',
            'reports/js/filters/case_list_explorer_knockout_bindings',
            'reports/js/filters/main',
            'datatables.fixedColumns',
            'fixtures/js/view-table'
        ],
        'settings/js/bundle': [
            'select2-3.5.2-legacy/select2',
            'settings/js/edit_my_account'
        ],
        'scheduling/js/bundle': [
            'select2-3.5.2-legacy/select2',
            'bootstrap-timepicker/js/bootstrap-timepicker',
            'hqwebapp/js/select2_handler',
            'jquery-ui/ui/core',
            'jquery-ui/ui/datepicker',
            'scheduling/js/create_schedule.ko',
            'data_interfaces/js/make_read_only',
            'locations/js/widgets_main',
            'scheduling/js/create_schedule_main',
            'datatables',
            'datatables.fixedColumns',
            'datatables.bootstrap',
            'scheduling/js/broadcasts_list',
            'data_interfaces/js/case_rule_criteria',
            'scheduling/js/conditional_alert_main'
        ],
        'groups/js/bundle': [
            'groups/js/all_groups'
        ],
        'reports/js/bundle': [
            'clipboard/dist/clipboard',
            'case/js/case_property_modal',
            'hqwebapp/js/assert_properties',
            'DOMPurify/dist/purify.min',
            'hqwebapp/js/components/inline_edit',
            'hqwebapp/js/components/pagination',
            'hqwebapp/js/components.ko',
            'reports/js/data_corrections',
            'reports/js/readable_form',
            'reports/js/single_form',
            'jquery-treetable/jquery.treetable',
            'case/js/case_hierarchy',
            'case/js/repeat_records',
            'jquery-memoized-ajax/jquery.memoized.ajax.min',
            'reports/js/case_details',
            'multiselect/js/jquery.multi-select',
            'quicksearch/dist/jquery.quicksearch.min',
            'hqwebapp/js/multiselect_utils',
            'select2-3.5.2-legacy/select2',
            'hqwebapp/js/widgets',
            'reports/js/edit_scheduled_report',
            'reports/js/form_data_main',
            'reports/js/standard_hq_report',
            'jquery-ui/ui/core',
            'jquery-ui/ui/datepicker',
            'reports/js/report_config_models',
            'jquery-ui/ui/widget',
            'jquery-ui/ui/mouse',
            'jquery-ui/ui/sortable',
            'hqwebapp/js/knockout_bindings.ko',
            'reports/js/saved_reports_main'
        ],
        'hqadmin/js/bundle': [
            'hqadmin/js/system_info',
            'jquery-treetable/jquery.treetable',
            'hqadmin/js/admin_restore',
            'hqadmin/js/authenticate_as',
            'hqadmin/js/raw_couch_main'
        ],
        'sms/js/bundle': [
            'hqwebapp/js/crud_paginated_list',
            'hqwebapp/js/crud_paginated_list_init',
            'sms/js/manage_registration_invitations',
            'select2-3.5.2-legacy/select2',
            'bootstrap-timepicker/js/bootstrap-timepicker',
            'hqwebapp/js/select2_handler',
            'sms/js/settings'
        ],
        'smsbillables/js/bundle': [
            'select2-3.5.2-legacy/select2',
            'bootstrap-timepicker/js/bootstrap-timepicker',
            'hqwebapp/js/select2_handler',
            'hqwebapp/js/widgets',
            'smsbillables/js/smsbillables.rate_calc'
        ],
        'appstore/js/bundle': [
            'appstore/js/facet_sidebar',
            'appstore/js/appstore_base',
            'appstore/js/project_info'
        ],
        'telerivet/js/bundle': [
            'telerivet/js/telerivet_setup'
        ],
        'notifications/js/bundle': [
            'notifications/js/manage_notifications'
        ],
        'domain/js/bundle': [
            'domain/js/media_manager',
            'domain/js/internal_calculations',
            'jquery-ui/ui/core',
            'jquery-ui/ui/datepicker',
            'domain/js/create_snapshot',
            'select2-3.5.2-legacy/select2',
            'domain/js/pro-bono',
            'domain/js/commtrack_settings',
            'domain/js/snapshot_settings',
            'multiselect/js/jquery.multi-select',
            'quicksearch/dist/jquery.quicksearch.min',
            'hqwebapp/js/multiselect_utils',
            'domain/js/internal_settings',
            'domain/js/my_project_settings',
            'domain/js/case_search',
            'jquery-ui/ui/widget',
            'jquery-ui/ui/mouse',
            'jquery-ui/ui/sortable',
            'hqwebapp/js/knockout_bindings.ko',
            'domain/js/case_search_main',
            'select2/dist/js/select2.full.min',
            'hqwebapp/js/select_2_ajax_widget',
            'domain/js/info_basic'
        ],
        'locations/js/bundle': [
            'select2-3.5.2-legacy/select2',
            'locations/js/location_types',
            'select2/dist/js/select2.full.min',
            'locations/js/utils',
            'locations/js/location_tree',
            'locations/js/locations',
            'locations/js/import',
            'locations/js/location_drilldown',
            'hqwebapp/js/select_2_ajax_widget',
            'hqwebapp/js/widgets',
            'locations/js/widgets_main',
            'locations/js/location'
        ],
        'data_interfaces/js/bundle': [
            'hqwebapp/js/crud_paginated_list',
            'data_interfaces/js/list_automatic_update_rules'
        ],
        'linked_domain/js/bundle': [
            'linked_domain/js/domain_links'
        ],
        'toggle_ui/js/bundle': [
            'jquery-ui/ui/core',
            'jquery-ui/ui/widget',
            'jquery-ui/ui/mouse',
            'jquery-ui/ui/sortable',
            'hqwebapp/js/knockout_bindings.ko',
            'toggle_ui/js/edit-flag',
            'datatables',
            'datatables.bootstrap',
            'reports/js/config.dataTables.bootstrap',
            'toggle_ui/js/flags'
        ],
        'hqwebapp/js/bundle': [
            'hqwebapp/js/bulk_upload_file',
            'select2-3.5.2-legacy/select2',
            'hqwebapp/js/widgets',
            'hqwebapp/js/crud_paginated_list',
            'hqwebapp/js/crud_paginated_list_init'
        ],
        'hqcase/js/bundle': [
            'select2-3.5.2-legacy/select2',
            'hqcase/js/explode_cases'
        ],
        'indicators/js/bundle': [
            'multiselect/js/jquery.multi-select',
            'quicksearch/dist/jquery.quicksearch.min',
            'hqwebapp/js/multiselect_utils',
            'indicators/js/copy_to_domain'
        ]
    }
});
