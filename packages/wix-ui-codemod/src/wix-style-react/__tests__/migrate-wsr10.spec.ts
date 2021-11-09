import { defineTest } from 'jscodeshift/src/testUtils';

defineTest(__dirname, 'migrate-wsr10', {}, 'migrate-wsr10/aliased-imports');
defineTest(__dirname, 'migrate-wsr10', {}, 'migrate-wsr10/components-rename');
defineTest(__dirname, 'migrate-wsr10', {}, 'migrate-wsr10/components-remove');
defineTest(__dirname, 'migrate-wsr10', {}, 'migrate-wsr10/properties-update');
defineTest(__dirname, 'migrate-wsr10', {}, 'migrate-wsr10/not-wsr-components');
defineTest(__dirname, 'migrate-wsr10', {}, 'migrate-wsr10/mixed-cases');

defineTest(
  __dirname,
  'migrate-wsr10',
  { backwardsCompatibleOnly: true },
  'migrate-wsr10/backwards-compatible/aliased-imports',
);
defineTest(
  __dirname,
  'migrate-wsr10',
  { backwardsCompatibleOnly: true },
  'migrate-wsr10/backwards-compatible/components-rename',
);
defineTest(
  __dirname,
  'migrate-wsr10',
  { backwardsCompatibleOnly: true },
  'migrate-wsr10/backwards-compatible/components-remove',
);
defineTest(
  __dirname,
  'migrate-wsr10',
  { backwardsCompatibleOnly: true },
  'migrate-wsr10/backwards-compatible/properties-update',
);
defineTest(
  __dirname,
  'migrate-wsr10',
  { backwardsCompatibleOnly: true },
  'migrate-wsr10/backwards-compatible/not-wsr-components',
);
defineTest(
  __dirname,
  'migrate-wsr10',
  { backwardsCompatibleOnly: true },
  'migrate-wsr10/backwards-compatible/mixed-cases',
);
