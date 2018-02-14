# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-13 11:41
from __future__ import unicode_literals

from __future__ import absolute_import
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('scheduling', '0009_randomtimedevent'),
    ]

    operations = [
        migrations.CreateModel(
            name='CasePropertyTimedEvent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField()),
                ('day', models.IntegerField()),
                ('case_property_name', models.CharField(max_length=126)),
                ('custom_content', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='scheduling.CustomContent')),
                ('email_content', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='scheduling.EmailContent')),
                ('ivr_survey_content', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='scheduling.IVRSurveyContent')),
                ('schedule', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='scheduling.TimedSchedule')),
                ('sms_content', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='scheduling.SMSContent')),
                ('sms_survey_content', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='scheduling.SMSSurveyContent')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
