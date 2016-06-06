from casexml.apps.case.mock import CaseFactory, CaseIndex, CaseStructure
from corehq.form_processor.interfaces.dbaccessors import CaseAccessors
from casexml.apps.case.xform import get_extensions_to_close
from casexml.apps.phone.tests.utils import create_restore_user
from casexml.apps.phone.tests.test_sync_mode import SyncBaseTest
from corehq.apps.domain.models import Domain
from corehq.form_processor.tests.utils import FormProcessorTestUtils, run_with_all_backends
from corehq.util.test_utils import flag_enabled
from corehq.apps.users.dbaccessors.all_commcare_users import delete_all_users


class AutoCloseExtensionsTest(SyncBaseTest):

    def setUp(self):
        FormProcessorTestUtils.delete_all_cases()
        FormProcessorTestUtils.delete_all_xforms()
        delete_all_users()
        self.domain = "domain"
        self.project = Domain(name=self.domain)
        self.user = create_restore_user(self.domain, username='name', password="changeme")
        self.factory = CaseFactory(domain=self.domain)
        self.extension_ids = ['1', '2', '3']
        self.host_id = 'host'

    def tearDown(self):
        FormProcessorTestUtils.delete_all_cases()
        FormProcessorTestUtils.delete_all_xforms()
        delete_all_users()

    def _create_extension_chain(self):
        host = CaseStructure(case_id=self.host_id)
        extension = CaseStructure(
            case_id=self.extension_ids[0],
            indices=[CaseIndex(
                related_structure=host,
                relationship="extension",
            )],
        )
        extension_2 = CaseStructure(
            case_id=self.extension_ids[1],
            indices=[CaseIndex(
                related_structure=extension,
                relationship="extension",
            )],
        )
        extension_3 = CaseStructure(
            case_id=self.extension_ids[2],
            indices=[CaseIndex(
                related_structure=extension_2,
                relationship="extension",
            )],
        )
        return self.factory.create_or_update_cases([extension_3])

    def _create_host_is_subcase_chain(self):
        parent = CaseStructure(case_id='parent')
        host = CaseStructure(
            case_id=self.host_id,
            indices=[CaseIndex(
                related_structure=parent,
                relationship="child",
            )],
        )
        extension = CaseStructure(
            case_id=self.extension_ids[0],
            indices=[CaseIndex(
                related_structure=host,
                relationship="extension",
            )],
        )
        extension_2 = CaseStructure(
            case_id=self.extension_ids[1],
            indices=[CaseIndex(
                related_structure=extension,
                relationship="extension",
            )],
        )
        return self.factory.create_or_update_cases([extension_2])

    @run_with_all_backends
    def test_get_extension_chain_simple(self):
        host = CaseStructure(case_id=self.host_id)
        extension = CaseStructure(
            case_id=self.extension_ids[0],
            indices=[CaseIndex(
                related_structure=host,
                relationship="extension",
            )],
        )
        self.factory.create_or_update_cases([extension])
        self.assertEqual(
            set(self.extension_ids[0]),
            CaseAccessors(self.domain).get_extension_chain([self.host_id])
        )

    @run_with_all_backends
    def test_get_extension_chain_multiple(self):
        created_cases = self._create_extension_chain()
        self.assertEqual(
            set(self.extension_ids),
            CaseAccessors(self.domain).get_extension_chain([created_cases[-1].case_id])
        )

    @flag_enabled('EXTENSION_CASES_SYNC_ENABLED')
    @run_with_all_backends
    def test_get_extension_to_close(self):
        """should return empty if case is not a host, otherwise should return full chain"""
        created_cases = self._create_extension_chain()
        # host open, should be empty
        no_cases = get_extensions_to_close(created_cases[-1], self.domain)
        self.assertEqual(set(), no_cases)

        created_cases[-1] = self.factory.create_or_update_case(CaseStructure(
            case_id=self.host_id,
            attrs={'close': True}
        ))[0]

        # host closed, should get full chain
        full_chain = get_extensions_to_close(created_cases[-1], self.domain)
        self.assertEqual(set(self.extension_ids), full_chain)

        # extension (not a host), should be empty
        no_cases = get_extensions_to_close(created_cases[2], self.domain)
        self.assertEqual(set(), no_cases)

    @flag_enabled('EXTENSION_CASES_SYNC_ENABLED')
    @run_with_all_backends
    def test_get_extension_to_close_child_host(self):
        """should still return extension chain if outgoing index is a child index"""
        created_cases = self._create_host_is_subcase_chain()
        # host open, should be empty
        no_cases = get_extensions_to_close(created_cases[-1], self.domain)
        self.assertEqual(set(), no_cases)

        # close parent, shouldn't get extensions
        created_cases[-1] = self.factory.create_or_update_case(CaseStructure(
            case_id='parent',
            attrs={'close': True}
        ))[0]
        no_cases = get_extensions_to_close(created_cases[-1], self.domain)
        self.assertEqual(set(), no_cases)

        # close host that is also a child
        created_cases[-2] = self.factory.create_or_update_case(CaseStructure(
            case_id=self.host_id,
            attrs={'close': True}
        ))[0]
        full_chain = get_extensions_to_close(created_cases[-2], self.domain)
        self.assertEqual(set(self.extension_ids[0:2]), full_chain)

    @flag_enabled('EXTENSION_CASES_SYNC_ENABLED')
    @run_with_all_backends
    def test_close_cases_host(self):
        """Closing a host should close all the extensions"""
        self._create_extension_chain()
        self.assertFalse(CaseAccessors(self.domain).get_case(self.extension_ids[0]).closed)
        self.assertFalse(CaseAccessors(self.domain).get_case(self.extension_ids[1]).closed)
        self.assertFalse(CaseAccessors(self.domain).get_case(self.extension_ids[2]).closed)

        self.factory.create_or_update_case(CaseStructure(
            case_id=self.extension_ids[0],
            attrs={'close': True}
        ))
        self.assertFalse(CaseAccessors(self.domain).get_case(self.host_id).closed)
        self.assertTrue(CaseAccessors(self.domain).get_case(self.extension_ids[0]).closed)
        self.assertFalse(CaseAccessors(self.domain).get_case(self.extension_ids[1]).closed)
        self.assertFalse(CaseAccessors(self.domain).get_case(self.extension_ids[2]).closed)

        self.factory.create_or_update_case(CaseStructure(
            case_id=self.host_id,
            attrs={'close': True}
        ))
        self.assertTrue(CaseAccessors(self.domain).get_case(self.host_id).closed)
        self.assertTrue(CaseAccessors(self.domain).get_case(self.extension_ids[0]).closed)
        self.assertTrue(CaseAccessors(self.domain).get_case(self.extension_ids[1]).closed)
        self.assertTrue(CaseAccessors(self.domain).get_case(self.extension_ids[2]).closed)

    @flag_enabled('EXTENSION_CASES_SYNC_ENABLED')
    @run_with_all_backends
    def test_close_cases_child(self):
        """Closing a host that is also a child should close all the extensions"""
        self._create_host_is_subcase_chain()

        self.assertFalse(CaseAccessors(self.domain).get_case(self.host_id).closed)
        self.assertFalse(CaseAccessors(self.domain).get_case(self.extension_ids[0]).closed)
        self.assertFalse(CaseAccessors(self.domain).get_case(self.extension_ids[1]).closed)

        self.factory.create_or_update_case(CaseStructure(
            case_id=self.host_id,
            attrs={'close': True}
        ))

        self.assertFalse(CaseAccessors(self.domain).get_case('parent').closed)
        self.assertTrue(CaseAccessors(self.domain).get_case(self.host_id).closed)
        self.assertTrue(CaseAccessors(self.domain).get_case(self.extension_ids[0]).closed)
        self.assertTrue(CaseAccessors(self.domain).get_case(self.extension_ids[1]).closed)
