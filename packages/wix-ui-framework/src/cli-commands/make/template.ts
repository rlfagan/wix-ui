import fs from 'fs-extra';
import ejs from 'ejs';

import { fileExists } from '../../file-exists';
import { WufError, ErrorKind } from '../../errors';
import { stringUtils } from './string-utils';

export interface RenderTemplate {
  templatePath: string;
  output: string;
  data: Record<string, unknown>;
}

const resolveTemplate = async ({ requirePath }) => {
  if (!(await fileExists(requirePath))) {
    throw new WufError({
      kind: ErrorKind.UserError,
      name: 'TemplateError',
      message: `file not found at "${requirePath}".`,
    });
  }

  try {
    return await fs.readFile(requirePath, 'utf8');
  } catch (error) {
    throw new WufError({
      kind: ErrorKind.SystemError,
      name: 'TemplateError',
      message: `Unable to read template file at "${requirePath}"`,
      error,
    });
  }
};

export const renderTemplate = async ({
  templatePath,
  output,
  data,
}: RenderTemplate) => {
  const template = await resolveTemplate({ requirePath: templatePath });
  if (template) {
    const source = ejsRender({ template, data });
    await fs.outputFile(output, source, { encoding: 'utf8' });
  }
};

const ejsRender = ({ template, data }) => {
  try {
    return ejs.render(template, { ...data, utils: stringUtils });
  } catch (error) {
    throw new WufError({
      name: 'EjsError',
      kind: ErrorKind.SystemError,
      message: `Template file contains error`,
      error,
    });
  }
};
