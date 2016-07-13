from django.test import TestCase
from corehq.apps.domain.models import Domain

from corehq.apps.groups.models import Group
from corehq.apps.users.models import CommCareUser, DomainMembership
from corehq.apps.users.dbaccessors.all_commcare_users import delete_all_users

DOMAIN = 'fixture-test'

class OtaRestoreUserTest(TestCase):

    @classmethod
    def setUpClass(cls):
        cls.domain = Domain.get_or_create_with_name(DOMAIN, is_active=True)
        cls.domain.commtrack_enabled = True
        cls.domain.save()
        cls.user = CommCareUser(domain=DOMAIN,
                                domain_membership=DomainMembership(domain=DOMAIN, location_id='1'))
        cls.restore_user = cls.user.to_ota_restore_user()

    @classmethod
    def tearDownClass(cls):
        delete_all_users()
        cls.domain.delete()

    def test_get_commtrack_location_id(self):
        self.assertEqual(self.restore_user.get_commtrack_location_id(), '1')
