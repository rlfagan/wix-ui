import { Path, Process } from '../../typings.d';

export interface OptionsRaw {
  input?: Path;
  output?: Path;
  template?: Path;
  plugin?: Path[];
  _process: Process;
}

export interface Options extends OptionsRaw {
  template?: string;
  components: {
    name: string;
    path: string;
  }[];
}
