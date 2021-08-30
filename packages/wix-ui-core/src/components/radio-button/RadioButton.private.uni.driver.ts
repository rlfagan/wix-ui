import { radioButtonUniDriverFactory as publicDriverFactory } from './RadioButton.uni.driver';
import { dataHooks } from './constants';

export const radioButtonPrivateDriverFactory = (base) => {
  const byHook = (hook: string) => base.$(`[data-hook="${hook}"]`);
  const getInput = () => byHook(dataHooks.hiddenRadio);

  return {
    ...publicDriverFactory(base),
    getAriaLabel: async () => getInput().attr('aria-label'),
    getAriaDescribedBy: async () => getInput().attr('aria-describedby'),
    getAriaLabeledBy: async () => getInput().attr('aria-labelledby'),
  };
};
