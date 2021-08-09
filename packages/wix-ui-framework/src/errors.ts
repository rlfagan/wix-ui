export const enum ErrorKind {
  UserError = 'UserError',
  SystemError = 'SystemError',
}

export class WufError<Info> extends Error {
  readonly info: Record<string, Info>;
  readonly kind: ErrorKind;
  constructor(options: {
    name: string;
    kind: ErrorKind;
    message: string;
    error?: Error;
    info?: Record<string, Info>;
  }) {
    super(
      `WUF ${options.kind} ${options.name}: ${options.message}${
        options.error ? `\n${options.error.stack}` : ''
      }`,
    );
    this.info = options.info;
    this.name = options.name;
    this.kind = options.kind;
  }
}

export const resolveOrThrow = <T>(
  fn: () => T,
  error: (e: Error) => Error,
): T | never => {
  try {
    return fn();
  } catch (e) {
    throw error(e);
  }
};
