import { defineTest } from 'jscodeshift/src/testUtils';

defineTest(__dirname, 'migrate-wsr10', {}, 'migrate-wsr10/components-rename');
defineTest(__dirname, 'migrate-wsr10', {}, 'migrate-wsr10/properties-update');
defineTest(__dirname, 'migrate-wsr10', {}, 'migrate-wsr10/not-wsr-components');
defineTest(__dirname, 'migrate-wsr10', {}, 'migrate-wsr10/mixed-cases');
