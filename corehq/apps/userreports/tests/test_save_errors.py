from __future__ import absolute_import
from __future__ import unicode_literals
import uuid

from alembic.operations import Operations
from alembic.runtime.migration import MigrationContext
from django.test import TestCase

from corehq.apps.userreports.app_manager.helpers import clean_table_name
from corehq.apps.userreports.exceptions import TableNotFoundWarning, MissingColumnWarning
from corehq.apps.userreports.models import DataSourceConfiguration
from corehq.apps.userreports.util import get_indicator_adapter
from corehq.sql_db.connections import connection_manager


def get_sample_config():
    return DataSourceConfiguration(
        domain='domain',
        display_name='foo',
        referenced_doc_type='CommCareCase',
        table_id=clean_table_name('domain', str(uuid.uuid4().hex)),
        configured_indicators=[{
            "type": "expression",
            "expression": {
                "type": "property_name",
                "property_name": 'name'
            },
            "column_id": 'name',
            "display_name": 'name',
            "datatype": "string"
        }],
    )


class SaveErrorsTest(TestCase):

    def setUp(self):
        self.config = get_sample_config()

    def test_raise_error_for_missing_table(self):
        adapter = get_indicator_adapter(self.config, raise_errors=True)
        adapter.drop_table()

        doc = {
            "_id": '123',
            "domain": "domain",
            "doc_type": "CommCareCase",
            "name": 'bob'
        }
        with self.assertRaises(TableNotFoundWarning):
            adapter.best_effort_save(doc)

    def test_missing_column(self):
        adapter = get_indicator_adapter(self.config, raise_errors=True)
        adapter.build_table()
        with adapter.engine.begin() as connection:
            context = MigrationContext.configure(connection)
            op = Operations(context)
            op.drop_column(adapter.get_table().name, 'name')

        doc = {
            "_id": '123',
            "domain": "domain",
            "doc_type": "CommCareCase",
            "name": 'bob'
        }
        with self.assertRaises(MissingColumnWarning):
            adapter.best_effort_save(doc)


class IndicatorAdapterTest(TestCase):

    def setUp(self):
        self.config = get_sample_config()

    def test_bulk_save(self):
        docs = []
        for i in range(10):
            docs.append({
                "_id": str(i),
                "domain": "domain",
                "doc_type": "CommCareCase",
                "name": 'doc_name_' + str(i)
            })

        adapter = get_indicator_adapter(self.config, raise_errors=True)
        adapter.build_table()
        adapter.bulk_save(docs)
        table = adapter.get_table()

        engine = connection_manager.get_engine('default')
        with engine.begin() as connection:
            results = connection.execute(table.select([table.c.doc_id, table.c.name]))

        self.assertEqual(len(results), 10)
