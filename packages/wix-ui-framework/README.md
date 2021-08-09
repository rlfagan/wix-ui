```
 __        ___   _ _____ 
 \ \      / / | | |  ___|
  \ \ /\ / /| | | | |
   \ V  V / | |_| |  _|
    \_/\_/   \___/|_|

```

> **w**ix-**u**i-**f**ramework

command line tool for common wix-ui libraries tasks

---

# Install

`npm install wix-ui-framework`

# Use

```
wuf --help
wuf generate --help
wuf export-testkits --help
wuf update --help
```

see [docs/usage.md](docs/usage.md) for more details.

## `wuf`

```md
Usage: wuf [options] [command]

Options:
  -v, --version              output the version number
  -h, --help                 output usage information

Commands:
  generate [options]         Scaffold file structure from templates
  export-testkits [options]  Generate testkit export file
  update [options]           Update components list file
```

---

## `wuf generate`

```md
Usage: wuf generate [options]

Scaffold file structure from templates

Options:
  --component-name <string>  Component name
  --description <string>     Component description
  --templates <string>       Path to templates. Default is
                             "/generator/templates/"
  --output <string>          Path to output. If not set, output is determined
                             by --templates folder structure
  --codemods <string>        Path to codemods. By default no codemods are run.
  -f, --force                Force component generation in a non clean git
                             repo.
  -h, --help                 display help for command
```

See more at [docs/generate.md](docs/generate.md)

---

## `wuf export-testkits`

```md
Usage: wuf export-testkits [options]

Generate testkit export file

Options:
  --output <string>       Mandatory option to set where to write testkit
                          exports file
  --definitions <string>  Path to testkit definitions. Default is
                          ".wuf/testkit-definitions.js"
  --components <string>   Path to components.json file. Default is
                          ".wuf/components.json"
  --template <string>     Path ejs template file. Default is
                          ".wuf/testkits/template.ejs"
  -h, --help              display help for command
```

See more at [docs/export-testkits.md](docs/export-testkits.md)

---

## `wuf update`

```md
Usage: wuf update [options]

Update components list file

Options:
  --shape <string>           Path to json file describing folder structure of
                             required files. Default is
                             `.wuf/required-component-files.json`
  --components <string>      Path to folder where components reside. Default is
                             `src/components`
  --output <string>          Path to output file. Default is
                             `.wuf/components.json`
  --verbose-output <string>  Path to verbose output file. This file includes
                             same JSON data as --output file but with
                             additional information. File is not created if
                             option not given. Default is undefined.
  --exclude <string>         Regular expression of known paths to exclude. For
                             example --exclude (Button|Table). Default is
                             undefined
  --max-mismatch <number>    Optional number of maximum mismatches between
                             shape defined in required-component-files.json and
                             component. Default is 0
  -h, --help                 display help for command
```

See more at [docs/update.md](docs/update.md)

---

## `wuf make`

```md
Usage: wuf make [options]

combine data from `wuf update`, template and optional plugins to generate any kind of code.

Options:
  --input <string>      Path to `components.json` file created with `wuf
                        update`. Default is `.wuf/components.json`
  --output <string>     Path of root folder where generated files should be
                        created. Default is `./src`
  --template <string>   Path to EJS template to be used for generating code.
                        Can be path directly to a single ejs file, or path to a
                        folder containing templates.
  --plugin <string...>  Name of a built-in plugin or path to one. This flag can
                        be used multiple times to enable multiple plugins.
                        Plugins are executed in the same order they are
                        provided. By default, no plugins are used.
  -h, --help            display help for command
```

See more at [docs/make.md](docs/make.md)

---

## `wuf help`

```md
Usage: wuf [options] [command]

Options:
  -v, --version              output the version number
  -h, --help                 display help for command

Commands:
  generate [options]         Scaffold file structure from templates
  export-testkits [options]  Generate testkit export file
  update [options]           Update components list file
  make [options]             combine data from `wuf update`, template and
                             optional plugins to generate any kind of code.
  help [command]             display help for command
```

See more at [docs/help.md](docs/help.md)

