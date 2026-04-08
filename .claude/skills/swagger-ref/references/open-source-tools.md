# Swagger - Open-Source-Tools

**Pages:** 59

---

## Plug points | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-ui/customization/plug-points/

**Contents:**
- Plug points
  - Note: Semantic Versioning
  - fn.opsFilter
  - Logo component
  - JSON Schema components
    - Example Date-Picker plugin
  - Request Snippets
  - Error handling
      - componentDidCatch
      - withErrorBoundary

Swagger UI exposes most of its internal logic through the plugin system.

Often, it is beneficial to override the core internals to achieve custom behavior.

Swagger UI’s internal APIs are not part of our public contract, which means that they can change without the major version change.

If your custom plugins wrap, extend, override, or consume any internal core APIs, we recommend specifying a specific minor version of Swagger UI to use in your application, because they will not change between patch versions.

If you’re installing Swagger UI via NPM, for example, you can do this by using a tilde:

When using the filter option, tag names will be filtered by the user-provided value. If you’d like to customize this behavior, you can override the default opsFilter function.

For example, you can implement a multiple-phrase filter:

While using the Standalone Preset the SwaggerUI logo is rendered in the Top Bar. The logo can be exchanged by replacing the Logo component via the plugin api:

In swagger there are so called JSON Schema components. These are used to render inputs for parameters and components of request bodies with application/x-www-form-urlencoded or multipart/* media-type.

Internally swagger uses following mapping to find the JSON Schema component from OpenAPI Specification schema information:

For each schema’s type(eg. string, array, …) and if defined schema’s format (eg. ‘date’, ‘uuid’, …) there is a corresponding component mapping:

Fallback if JsonSchema_${type}_${format} component does not exist or format not defined:

With this, one can define custom input components or override existing.

If one would like to input date values you could provide a custom plugin to integrate react-datepicker into swagger-ui. All you need to do is to create a component to wrap react-datepicker accordingly to the format.

This creates the need for two components and simple logic to strip any time input in case the format is date:

SwaggerUI can be configured with the requestSnippetsEnabled: true option to activate Request Snippets. Instead of the generic curl that is generated upon doing a request. It gives you more granular options:

There might be the case where you want to provide your own snipped generator. This can be done by using the plugin api. A Request Snipped generator consists of the configuration and a fn, which takes the internal request object and transforms it to the desired snippet.

SwaggerUI comes with a safe-render plugin that handles error handling allows plugging into error handling system and modify it.

The plugin accepts a list of component names that should be protected by error boundaries.

Its public API looks like this:

safe-render plugin is automatically utilized by base and standalone SwaggerUI presets and should always be used as the last plugin, after all the components are already known to the SwaggerUI. The plugin defines a default list of components that should be protected by error boundaries:

As demonstrated below, additional components can be protected by utilizing the safe-render plugin with configuration options. This gets really handy if you are a SwaggerUI integrator and you maintain a number of plugins with additional custom components.

This static function is invoked after a component has thrown an error. It receives two parameters:

It has precisely the same signature as error boundaries componentDidCatch lifecycle method, except it’s a static function and not a class method.

Default implement of componentDidCatch uses console.error to display the received error:

To utilize your own error handling logic (e.g. bugsnag), create new SwaggerUI plugin that overrides componentDidCatch:

{% highlight js linenos %} const BugsnagErrorHandlerPlugin = () => { // init bugsnag

return { fn: { componentDidCatch = (error, info) => { Bugsnag.notify(error); Bugsnag.notify(info); }, }, }; }; {% endhighlight %}

This function is HOC (Higher Order Component). It wraps a particular component into the ErrorBoundary component. It can be overridden via a plugin system to control how components are wrapped by the ErrorBoundary component. In 99.9% of situations, you won’t need to override this function, but if you do, please read the source code of this function first.

The component is displayed when the error boundary catches an error. It can be overridden via a plugin system. Its default implementation is trivial:

Feel free to override it to match your look & feel:

This is the component that implements React error boundaries. Uses componentDidCatch and Fallback under the hood. In 99.9% of situations, you won’t need to override this component, but if you do, please read the source code of this component first.

In prior releases of SwaggerUI (before v4.3.0), almost all components have been protected, and when thrown error, Fallback component was displayed. This changes with SwaggerUI v4.3.0. Only components defined by the safe-render plugin are now protected and display fallback. If a small component somewhere within SwaggerUI React component tree fails to render and throws an error. The error bubbles up to the closest error boundary, and that error boundary displays the Fallback component and invokes componentDidCatch.

**Examples:**

Example 1 (json):
```json
1{2  "dependencies": {3    "swagger-ui": "~3.11.0"4  }5}
```

Example 2 (javascript):
```javascript
1const MultiplePhraseFilterPlugin = function() {2  return {3    fn: {4      opsFilter: (taggedOps, phrase) => {5        const phrases = phrase.split(", ")6
7        return taggedOps.filter((val, key) => {8          return phrases.some(item => key.indexOf(item) > -1)9        })10      }11    }12  }13}
```

Example 3 (jsx):
```jsx
1import React from "react";2const MyLogoPlugin = {3  components: {4    Logo: () => (5      <img alt="My Logo" height="40" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTM3IiBoZWlnaHQ9IjEzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHRleHQgdHJhbnNmb3JtPSJtYXRyaXgoMy40Nzc2OSAwIDAgMy4yNjA2NyAtNjczLjEyOCAtNjkxLjk5MykiIHN0cm9rZT0iIzAwMCIgZm9udC1zdHlsZT0ibm9ybWFsIiBmb250LXdlaWdodD0ibm9ybWFsIiB4bWw6c3BhY2U9InByZXNlcnZlIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIGZvbnQtZmFtaWx5PSInT3BlbiBTYW5zIEV4dHJhQm9sZCciIGZvbnQtc2l6ZT0iMjQiIGlkPSJzdmdfMSIgeT0iMjQxLjIyMTkyIiB4PSIxOTYuOTY5MjEiIHN0cm9rZS13aWR0aD0iMCIgZmlsbD0iIzYyYTAzZiI+TXkgTG9nbzwvdGV4dD4KICA8cGF0aCBpZD0ic3ZnXzIiIGQ9Im0zOTUuNjAyNSw1MS4xODM1OWw1My44Nzc3MSwwbDE2LjY0ODYzLC01MS4xODM1OGwxNi42NDg2NCw1MS4xODM1OGw1My44Nzc3LDBsLTQzLjU4NzksMzEuNjMyODNsMTYuNjQ5NDksNTEuMTgzNThsLTQzLjU4NzkyLC0zMS42MzM2OWwtNDMuNTg3OTEsMzEuNjMzNjlsMTYuNjQ5NDksLTUxLjE4MzU4bC00My41ODc5MiwtMzEuNjMyODN6IiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzYyYTAzZiIvPgogPC9nPgo8L3N2Zz4="/>6    )7  }8}
```

Example 4 (bash):
```bash
1`JsonSchema_${type}_${format}`
```

---

## Swagger Codegen Generators Configuration | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/generators-configuration

**Contents:**
- Swagger Codegen Generators Configuration
- Bringing your own models

There are different aspects of customizing the code generator (located in this version at swagger codegen generator repo) beyond just creating or modifying templates. Each language has a supporting configuration file to handle different type mappings, etc:

Each of these files creates reasonable defaults so you can get running quickly. If you want to configure package names, prefixes, model folders, etc. you can use a JSON config file to pass the values.

and config.json contains the following as an example:

Supported config options can be different per language. Running config-help -l {lang} will show available options. These options are applied via configuration file (e.g. config.json) or by passing them with -D{optionName}={optionValue}.

If -D{optionName} does not work, please open a ticket and we’ll look into it.

Your config file for Java can look like

For all the unspecified options default values will be used.

Another way to override default options is to extend the config class for the specific language. To change, for example, the prefix for the Objective-C generated files, simply subclass the ObjcClientCodegen.java:

and specify the classname when running the generator:

Your subclass will now be loaded and overrides the PREFIX value in the superclass.

Sometimes you don’t want a model generated. In this case, you can simply specify an import mapping to tell the codegen what not to create. When doing this, every location that references a specific model will refer back to your classes.

Note, this may not apply to all languages!

To specify an import mapping, use the --import-mappings argument and specify the model-to-import logic as such:

Or for multiple mappings:

**Examples:**

Example 1 (lua):
```lua
1s -1 modules/swagger-codegen/src/main/java/io/swagger/codegen/languages/2
3AbstractJavaCodegen.java4AbstractJavaJAXRSServerCodegen.java5... (results omitted)6JavaClientCodegen.java7JavaJAXRSSpecServerCodegen.java
```

Example 2 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate \2  -i http://petstore.swagger.io/v2/swagger.json \3  -l java \4  -o samples/client/petstore/java \5  -c path/to/config.json
```

Example 3 (json):
```json
1{2  "apiPackage" : "petstore"3}
```

Example 4 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar config-help -l java
```

---

## Setting up a dev environment | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-ui/development/setting-up/

**Contents:**
- Setting up a dev environment
  - Prerequisites
  - Steps
  - Using your own local api definition with local dev build
- Bonus points

SwaggerUI includes a development server that provides hot module reloading and unminified stack traces, for easier development.

You can specify a local file in dev-helpers/dev-helper-initializer.js by changing the url parameter. This local file MUST be located in the dev-helpers directory or a subdirectory. As a convenience and best practice, we recommend that you create a subdirectory, dev-helpers/examples, which is already specified in .gitignore.

Files in dev-helpers should NOT be committed to git. The exception is if you are fixing something in index.html, oauth2-redirect.html, dev-helper-initializer.js, or introducing a new support file.

**Examples:**

Example 1 (yaml):
```yaml
1url: "https://petstore.swagger.io/v2/swagger.json",
```

Example 2 (yaml):
```yaml
1url: "./examples/your-local-api-definition.yaml",
```

---

## Swagger Codegen Prerequisites | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/prerequisites

**Contents:**
- Swagger Codegen Prerequisites
- OS X Users

If you’re looking for the latest stable version, you can grab it directly from Maven.org (Java 8 runtime at a minimum):

For Windows users, you will need to install wget or you can use Invoke-WebRequest in PowerShell (3.0+).

On a mac, it’s even easier with brew:

To build from source, you need the following installed and available in your $PATH:

Apache maven 3.6.2 or greater

Don’t forget to install Java 11+.

Export JAVA_HOME in order to use the supported Java version:

**Examples:**

Example 1 (unknown):
```unknown
1# Download current stable 2.x.x branch (Swagger and OpenAPI version 2)2wget https://repo1.maven.org/maven2/io/swagger/swagger-codegen-cli/2.4.46/swagger-codegen-cli-2.4.46.jar -O swagger-codegen-cli.jar3
4java -jar swagger-codegen-cli.jar help5
6# Download current stable 3.x.x branch (OpenAPI version 3)7wget https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.71/swagger-codegen-cli-3.0.71.jar -O swagger-codegen-cli.jar8
9java -jar swagger-codegen-cli.jar --help
```

Example 2 (unknown):
```unknown
1Invoke-WebRequest -OutFile swagger-codegen-cli.jar https://repo1.maven.org/maven2/io/swagger/swagger-codegen-cli/2.4.45/swagger-codegen-cli-2.4.45.jar
```

Example 3 (unknown):
```unknown
1brew install swagger-codegen
```

Example 4 (bash):
```bash
1export JAVA_HOME=`/usr/libexec/java_home -v 11`2export PATH=${JAVA_HOME}/bin:$PATH
```

---

## Swagger Codegen Selective Generation | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/generation-selective

**Contents:**
- Swagger Codegen Selective Generation

You may not want to generate all models in your project. Likewise you may want just one or two apis to be written. If that’s the case, you can use system properties to control the output:

The default is generate everything supported by the specific library. Once you enable a feature, it will restrict the contents generated:

To control the specific files being generated, you can pass a CSV list of what you want:

To control generation of docs and tests for api and models, pass false to the option. For api, these options are -DapiTests=false and -DapiDocs=false. For models, -DmodelTests=false and -DmodelDocs=false. These options default to true and don’t limit the generation of the feature options listed above (like -Dapi):

When using selective generation, only the templates needed for the specific generation will be used.

**Examples:**

Example 1 (unknown):
```unknown
1# generate only models2java -Dmodels {opts}3
4# generate only apis5java -Dapis {opts}6
7# generate only supporting files8java -DsupportingFiles9
10# generate models and supporting files11java -Dmodels -DsupportingFiles
```

Example 2 (sass):
```sass
1# generate the User and Pet models only2-Dmodels=User,Pet3
4# generate the User model and the supportingFile `StringUtil.java`:5-Dmodels=User -DsupportingFiles=StringUtil.java
```

Example 3 (sass):
```sass
1# generate only models (with tests and documentation)2java -Dmodels {opts}3
4# generate only models (with tests but no documentation)5java -Dmodels -DmodelDocs=false {opts}6
7# generate only User and Pet models (no tests and no documentation)8java -Dmodels=User,Pet -DmodelTests=false {opts}9
10# generate only apis (without tests)11java -Dapis -DapiTests=false {opts}12
13# generate only apis (modelTests option is ignored)14java -Dapis -DmodelTests=false {opts}
```

---

## Swagger Codegen Online Generators | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/online-generators

**Contents:**
- Swagger Codegen Online Generators

swagger-generator module exposes codegen as a web service, with it’s own swagger-js based web UI, and available docker image swaggerapi/swagger-generator-v3.

The web service is deployed at https://generator3.swagger.io/ui, or it can be easily deployed as docker container.

The OpenAPI specification of generator service APIs are available either via UI exposed by web service (e.g. https://generator3.swagger.io/ui), as exposed YAML (https://generator3.swagger.io/openapi.json) or in source code repo (https://github.com/swagger-api/swagger-codegen/blob/3.0.0/modules/swagger-generator/src/main/resources/openapi.yaml).

Please note that both V2 (for v2 specs) and V3 generators (for v3 and v2 specs converted during generation) are supported, by providing property codegenVersion (e.g "codegenVersion" : "v3").

For example, to generate a java API client, simply send the following HTTP request using curl:

The response will contain a zipped file containing the generated code.

To customize the SDK, you can specify language specific options with the following HTTP body:

in which the options additionalProperties for a language can be obtained by submitting a GET request to https://generator3.swagger.io/api/options?language={language}&version={codegenVersion}:

For example, curl https://generator3.swagger.io/api/options?language=java&version=V3 returns (truncated output):

Instead of using specURL with an URL to the OpenAPI/Swagger spec, one can include the spec in the JSON payload with spec, e.g.

**Examples:**

Example 1 (json):
```json
1curl -X POST \2  https://generator3.swagger.io/api/generate \3  -H 'content-type: application/json' \4  -d '{5  "specURL" : "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml",6  "lang" : "java",7  "type" : "CLIENT",8  "codegenVersion" : "V3"9}'
```

Example 2 (json):
```json
1{2  "specURL" : "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml",3  "lang" : "java",4  "options" : {5    "additionalProperties" : {6    "useRuntimeException": true,7    "useRxJava" : true8    }9  },10  "type" : "CLIENT",11  "codegenVersion" : "V3"12}
```

Example 3 (lua):
```lua
1{2  "sortParamsByRequiredFlag": {3    "opt": "sortParamsByRequiredFlag",4    "description": "Sort method arguments to place required parameters before optional parameters.",5    "type": "boolean",6    "default": "true"7  },8  "ensureUniqueParams": {9    "opt": "ensureUniqueParams",10    "description": "Whether to ensure parameter names are unique in an operation (rename parameters that are not).",11    "type": "boolean",12    "default": "true"13  },14  "allowUnicodeIdentifiers": {15    "opt": "allowUnicodeIdentifiers",16    "description": "boolean, toggles whether unicode identifiers are allowed in names or not, default is false",17    "type": "boolean",18    "default": "false"19  },20  "modelPackage": {21    "opt": "modelPackage",22    "description": "package for generated models",23    "type": "string"24  },25  ...
```

Example 4 (lua):
```lua
1{2  "options": {},3  "spec": {4    "swagger": "2.0",5    "info": {6      "version": "1.0.0",7      "title": "Test API"8    },9    ...10  }11}
```

---

## Swagger Codegen Selective Generation | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/generation-selective/

**Contents:**
- Swagger Codegen Selective Generation
- Ignore file format

You may not want to generate all models in your project. Likewise you may want just one or two apis to be written. If that’s the case, you can use system properties to control the output:

The default is generate everything supported by the specific library. Once you enable a feature, it will restrict the contents generated:

To control the specific files being generated, you can pass a CSV list of what you want:

To control generation of docs and tests for api and models, pass false to the option. For api, these options are -DapiTests=false and -DapiDocs=false. For models, -DmodelTests=false and -DmodelDocs=false. These options default to true and don’t limit the generation of the feature options listed above (like -Dapi):

When using selective generation, only the templates needed for the specific generation will be used.

Swagger Codegen supports a .swagger-codegen-ignore file, similar to .gitignore or .dockerignore you’re probably already familiar with.

The ignore file allows for better control over overwriting existing files than the --skip-overwrite flag. With the ignore file, you can specify individual files or directories can be ignored. This can be useful, for example if you only want a subset of the generated code.

The .swagger-codegen-ignore file must exist in the root of the output directory.

Upon first code generation, you may also pass the CLI option --ignore-file-override=/path/to/ignore_file for greater control over generated outputs. Note that this is a complete override, and will override the .swagger-codegen-ignore file in an output directory when regenerating code.

Editor support for .swagger-codegen-ignore files is available in IntelliJ via the .ignore plugin.

**Examples:**

Example 1 (unknown):
```unknown
1# generate only models2java -Dmodels {opts}3
4# generate only apis5java -Dapis {opts}6
7# generate only supporting files8java -DsupportingFiles9
10# generate models and supporting files11java -Dmodels -DsupportingFiles
```

Example 2 (sass):
```sass
1# generate the User and Pet models only2-Dmodels=User,Pet3
4# generate the User model and the supportingFile `StringUtil.java`:5-Dmodels=User -DsupportingFiles=StringUtil.java
```

Example 3 (sass):
```sass
1# generate only models (with tests and documentation)2java -Dmodels {opts}3
4# generate only models (with tests but no documentation)5java -Dmodels -DmodelDocs=false {opts}6
7# generate only User and Pet models (no tests and no documentation)8java -Dmodels=User,Pet -DmodelTests=false {opts}9
10# generate only apis (without tests)11java -Dapis -DapiTests=false {opts}12
13# generate only apis (modelTests option is ignored)14java -Dapis -DmodelTests=false {opts}
```

Example 4 (unknown):
```unknown
1# Swagger Codegen Ignore2# Lines beginning with a # are comments3
4# This should match build.sh located anywhere.5build.sh6
7# Matches build.sh in the root8/build.sh9
10# Exclude all recursively11docs/**12
13# Explicitly allow files excluded by other rules14!docs/UserApi.md15
16# Recursively exclude directories named Api17# You can't negate files below this directory.18src/**/Api/19
20# When this file is nested under /Api (excluded above),21# this rule is ignored because parent directory is excluded by previous rule.22!src/**/PetApiTests.cs23
24# Exclude a single, nested file explicitly25src/IO.Swagger.Test/Model/AnimalFarmTests.cs
```

---

## Swagger Codegen Prerequisites | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/prerequisites/

**Contents:**
- Swagger Codegen Prerequisites
- OS X Users

If you’re looking for the latest stable version, you can grab it directly from Maven.org (Java 8 runtime at a minimum):

For Windows users, you will need to install wget or you can use Invoke-WebRequest in PowerShell (3.0+). For example:

On a Mac, it’s even easier with brew:

To build from source, you need the following installed and available in your $PATH:

Don’t forget to install Java 11.

Export JAVA_HOME in order to use the supported Java version:

**Examples:**

Example 1 (unknown):
```unknown
1wget https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.71/swagger-codegen-cli-3.0.71.jar -O swagger-codegen-cli.jar2
3java -jar swagger-codegen-cli.jar --help
```

Example 2 (unknown):
```unknown
1Invoke-WebRequest -OutFile swagger-codegen-cli.jar https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.71/swagger-codegen-cli-3.0.71.jar
```

Example 3 (unknown):
```unknown
1brew install swagger-codegen
```

Example 4 (bash):
```bash
1export JAVA_HOME=`/usr/libexec/java_home -v 11`2export PATH=${JAVA_HOME}/bin:$PATH
```

---

## Configuration | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/

**Contents:**
- Configuration
  - How to configure
  - Parameters
      - Core
      - Plugin system
      - Display
      - Network
      - Macros
      - Authorization
  - Instance methods

Swagger UI accepts configuration parameters in three locations.

From lowest to highest precedence:

Parameters with dots in their names are single strings used to organize subordinate parameters, and are not indicative of a nested structure.

For readability, parameters are grouped by category and sorted alphabetically.

Type notations are formatted like so:

Read more about the plugin system in the Customization documentation.

💡 Take note! These are methods, not parameters.

If you’re using the Docker image, you can also control most of these options with environment variables. Each parameter has its environment variable name noted, if available.

Below are the general guidelines for using the environment variable interface.

Set the value to whatever string you’d like, taking care to escape characters where necessary

Set the value to true or false.

Set the value to n, where n is the number you’d like to provide.

Set the value to the literal array value you’d like, taking care to escape characters where necessary.

Set the value to the literal object value you’d like, taking care to escape characters where necessary.

**Examples:**

Example 1 (css):
```css
Object={
  generators: {
    curl_bash: {
      title: "cURL (bash)",
      syntax: "bash"
    },
    curl_powershell: {
      title: "cURL (PowerShell)",
      syntax: "powershell"
    },
    curl_cmd: {
      title: "cURL (CMD)",
      syntax: "bash"
    },
  },
  defaultExpanded: true,
  languages: null, 
  // e.g. only show curl bash = ["curl_bash"]
}
```

Example 2 (unknown):
```unknown
1FILTER="myFilterValue"2LAYOUT="BaseLayout"
```

Example 3 (unknown):
```unknown
1DISPLAY_OPERATION_ID="true"2DEEP_LINKING="false"
```

Example 4 (unknown):
```unknown
1DEFAULT_MODELS_EXPAND_DEPTH="5"2DEFAULT_MODEL_EXPAND_DEPTH="7"
```

---

## Swagger Codegen Building | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/building/

**Contents:**
- Swagger Codegen Building
- Homebrew
- To build a server stub
- To build the codegen library

After cloning the project, you can build it from source with this command:

To install, run brew install swagger-codegen

Here is an example usage:

Please refer to wiki for more information.

This will create the Swagger Codegen library from source.

The templates are included in the library generated. If you want to modify the templates, you’ll need to either repackage the library OR specify a path to your scripts.

**Examples:**

Example 1 (unknown):
```unknown
1mvn clean package
```

Example 2 (unknown):
```unknown
1swagger-codegen generate -i http://petstore.swagger.io/v2/swagger.json -l ruby -o /tmp/test/
```

Example 3 (unknown):
```unknown
1mvn package
```

---

## Swagger Codegen Online Generators | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/online-generators/

**Contents:**
- Swagger Codegen Online Generators

swagger-generator module exposes codegen as a web service, with it’s own swagger-js based web UI, and available docker image swaggerapi/swagger-generator-v3.

The web service is deployed at https://generator3.swagger.io/ui, or it can be easily deployed as docker container.

The OpenAPI specification of generator service APIs are available either via UI exposed by web service (e.g. https://generator3.swagger.io/ui), as exposed YAML (https://generator3.swagger.io/openapi.json) or in source code repo (https://github.com/swagger-api/swagger-codegen/blob/3.0.0/modules/swagger-generator/src/main/resources/openapi.yaml).

Please note that both V2 (for v2 specs) and V3 generators (for v3 and v2 specs converted during generation) are supported, by providing property codegenVersion (e.g "codegenVersion" : "v3").

For example, to generate a java API client, simply send the following HTTP request using curl:

The response will contain a zipped file containing the generated code.

To customize the SDK, you can specify language specific options with the following HTTP body:

in which the options additionalProperties for a language can be obtained by submitting a GET request to https://generator3.swagger.io/api/options?language={language}&version={codegenVersion}:

For example, curl https://generator3.swagger.io/api/options?language=java&version=V3 returns (truncated output):

Instead of using specURL with an URL to the OpenAPI/Swagger spec, one can include the spec in the JSON payload with spec, e.g.

**Examples:**

Example 1 (json):
```json
1curl -X POST \2  https://generator3.swagger.io/api/generate \3  -H 'content-type: application/json' \4  -d '{5  "specURL" : "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml",6  "lang" : "java",7  "type" : "CLIENT",8  "codegenVersion" : "V3"9}'
```

Example 2 (json):
```json
1{2  "specURL" : "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml",3  "lang" : "java",4  "options" : {5    "additionalProperties" : {6    "useRuntimeException": true,7    "useRxJava" : true8    }9  },10  "type" : "CLIENT",11  "codegenVersion" : "V3"12}
```

Example 3 (lua):
```lua
1{2  "sortParamsByRequiredFlag": {3    "opt": "sortParamsByRequiredFlag",4    "description": "Sort method arguments to place required parameters before optional parameters.",5    "type": "boolean",6    "default": "true"7  },8  "ensureUniqueParams": {9    "opt": "ensureUniqueParams",10    "description": "Whether to ensure parameter names are unique in an operation (rename parameters that are not).",11    "type": "boolean",12    "default": "true"13  },14  "allowUnicodeIdentifiers": {15    "opt": "allowUnicodeIdentifiers",16    "description": "boolean, toggles whether unicode identifiers are allowed in names or not, default is false",17    "type": "boolean",18    "default": "false"19  },20  "modelPackage": {21    "opt": "modelPackage",22    "description": "package for generated models",23    "type": "string"24  },25  ...
```

Example 4 (lua):
```lua
1{2  "options": {},3  "spec": {4    "swagger": "2.0",5    "info": {6      "version": "1.0.0",7      "title": "Test API"8    },9    ...10  }11}
```

---

## Swagger Codegen Generators | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/generators

**Contents:**
- Swagger Codegen Generators
- Modifying the client library format
- Making your own codegen modules
- Generating a client from local files

If the default generator configuration does not meet your needs, you have various options to modify or create new modules or templates.

Don’t like the default swagger client syntax? Want a different language supported? No problem!

Swagger Codegen processes handlebar templates with the Handlebars.java engine. You can modify our templates or make your own.

Take a look at swagger-codegen-generators for examples. To make your own templates, create your own files and use the -t flag to specify your template folder. It actually is that easy!

If you’re starting a project with a new language and don’t see what you need, Swagger Codegen can help you create a project to generate your own libraries:

This will write, in the folder output/myLibrary, all the files you need to get started, including a README.md. Once modified and compiled, you can load your library with the codegen and generate clients with your own, custom-rolled logic.

You would then compile your library in the output/myLibrary folder with mvn package and execute the codegen like such:

For Windows users, you will need to use ; instead of : in the classpath, e.g.:

Note the myClientCodegen is an option now, and you can use the usual arguments for generating your library:

See also standalone generator development.

If you don’t want to call your server, you can save the OpenAPI Description files into a directory and pass an argument to the code generator like this:

Great for creating libraries on your CI server, from the Swagger Editor … or while coding on an airplane ✈️.

**Examples:**

Example 1 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar meta \2  -o output/myLibrary -n myClientCodegen -p com.my.company.codegen
```

Example 2 (unknown):
```unknown
1java -cp output/myLibrary/target/myClientCodegen-swagger-codegen-1.0.0.jar:modules/swagger-codegen-cli/target/swagger-codegen-cli.jar io.swagger.codegen.v3.cli.SwaggerCodegen
```

Example 3 (unknown):
```unknown
1java -cp output/myLibrary/target/myClientCodegen-swagger-codegen-1.0.0.jar;modules/swagger-codegen-cli/target/swagger-codegen-cli.jar io.swagger.codegen.v3.cli.SwaggerCodegen
```

Example 4 (unknown):
```unknown
1java -cp output/myLibrary/target/myClientCodegen-swagger-codegen-1.0.0.jar:modules/swagger-codegen-cli/target/swagger-codegen-cli.jar \2  io.swagger.codegen.v3.cli.SwaggerCodegen generate -l myClientCodegen\3  -i http://petstore.swagger.io/v2/swagger.json \4  -o myClient
```

---

## Plugin system overview | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-ui/customization/overview/

**Contents:**
- Plugin system overview
  - Prior art
  - The System
  - Presets
  - getComponent

Swagger UI leans heavily on concepts and patterns found in React and Redux.

If you aren’t already familiar, here’s some suggested reading:

In the following documentation, we won’t take the time to define the fundamentals covered in the resources above.

Note: Some of the examples in this section contain JSX, which is a syntax extension to JavaScript that is useful for writing React components.

If you don’t want to set up a build pipeline capable of translating JSX to JavaScript, take a look at React without JSX (reactjs.org). You can use our system.React reference to leverage React without needing to pull a copy into your project.

The system is the heart of the Swagger UI application. At runtime, it’s a JavaScript object that holds many things:

The system is built up when Swagger UI is called by iterating through (“compiling”) each plugin that Swagger UI has been given, through the presets and plugins configuration options.

Presets are arrays of plugins, which are provided to Swagger UI through the presets configuration option. All plugins within presets are compiled before any plugins provided via the plugins configuration option. Consider the following example:

By default, Swagger UI includes the internal ApisPreset, which contains a set of plugins that provide baseline functionality for Swagger UI. If you specify your own presets option, you need to add the ApisPreset manually, like so:

The need to provide the apis preset when adding other presets is an artifact of Swagger UI’s original design, and will likely be removed in the next major version.

getComponent is a helper function injected into every container component, which is used to get references to components provided by the plugin system.

All components should be loaded through getComponent, since it allows other plugins to modify the component. It is preferred over a conventional import statement.

Container components in Swagger UI can be loaded by passing true as the second argument to getComponent, like so:

This will map the current system as props to the component.

**Examples:**

Example 1 (json):
```json
1const MyPreset = [FirstPlugin, SecondPlugin, ThirdPlugin]2
3SwaggerUI({4  presets: [5    MyPreset6  ]7})
```

Example 2 (json):
```json
1SwaggerUI({2  presets: [3    SwaggerUI.presets.apis,4    MyAmazingCustomPreset5  ]6})
```

Example 3 (unknown):
```unknown
1getComponent("ContainerComponentName", true)
```

---

## Swagger Codegen Using Docker | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/docker

**Contents:**
- Swagger Codegen Using Docker
- Development in docker
- Standalone generator Development in docker
- Run Docker in Vagrant
- Public Pre-built Docker images
  - Swagger Generator Docker Image
  - Swagger Generator “Minimal” Docker Image
  - Swagger Codegen CLI Docker Image

You can use run-in-docker.sh to do all development. This script maps your local repository to /gen in the docker container. It also maps ~/.m2/repository to the appropriate container location.

To execute mvn package:

Build artifacts are now accessible in your working directory.

Once built, run-in-docker.sh will act as an executable for swagger-codegen-cli. To generate code, you’ll need to output to a directory under /gen (e.g. /gen/out). For example:

See standalone generator development

Prerequisite: install Vagrant and VirtualBox.

The Swagger Generator image provides a ready to use web application (swagger-generator) providing code generation services.

Image accepts the following env variables:

An example of running the container:

docker pull swaggerapi/swagger-generator-v3

docker run -e "HIDDEN_OPTIONS=servers:foo,bar|clientsV3:fgf,sdsd" -e "JAVA_MEM=1024m" -e "HTTP_PORT=80" -p 80:80 --name swagger-generator-v3 -v /tmp:/jetty_home/lib/shared swaggerapi/swagger-generator-v3

docker run -e "HIDDEN_OPTIONS_PATH=/hiddenOptions.yaml" -e "JAVA_MEM=1024m" -e "HTTP_PORT=80" -p 80:80 --name swagger-generator-v3 -v /tmp:/jetty_home/lib/shared swaggerapi/swagger-generator-v3

This docker image supports custom generators by dropping the generator jar into /jetty_home/lib/shared directory (typically via a docker volume); e.g having on host /my/custom/coolgenerator.jar and /my/custom/weirdgenerator.jar the following would have them added to generator service generators:

docker run -e "HIDDEN_OPTIONS_PATH=/hiddenOptions.yaml" -e "JAVA_MEM=1024m" -e "HTTP_PORT=80" -p 80:80 --name swagger-generator-v3 -v /my/custom:/jetty_home/lib/shared swaggerapi/swagger-generator-v3

Please note that up to version 3.0.20 you need to provide-v /{WHATEVER_DIR}:/jetty_home/lib/shared even if not using custom generators.

See also online generators.

The Swagger Generator “Minimal” image can act as a self-hosted web application and API for generating code.

This container can be incorporated into a CI pipeline, and requires some docker orchestration to access generated code.

In the example above, result.zip will contain the generated client.

See also online generators.

The Swagger Codegen image acts as a standalone executable. It can be used as an alternative to installing via homebrew, or for developers who are unable to install Java or upgrade the installed version.

To generate code with this image, you’ll need to mount a local location as a volume.

The generated code will be located under ./out/go in the current directory.

**Examples:**

Example 1 (unknown):
```unknown
1git clone https://github.com/swagger-api/swagger-codegen2cd swagger-codegen3./run-in-docker.sh mvn package
```

Example 2 (sass):
```sass
1./run-in-docker.sh help # Executes 'help' command for swagger-codegen-cli2./run-in-docker.sh langs # Executes 'langs' command for swagger-codegen-cli3./run-in-docker.sh /gen/bin/go-petstore.sh  # Builds the Go client4./run-in-docker.sh generate -i modules/swagger-codegen/src/test/resources/2_0/petstore.yaml \5    -l go -o /gen/out/go-petstore -DpackageName=petstore # generates go client, outputs locally to ./out/go-petstore
```

Example 3 (unknown):
```unknown
1git clone http://github.com/swagger-api/swagger-codegen.git2cd swagger-codegen3vagrant up4vagrant ssh5cd /vagrant6./run-in-docker.sh mvn package
```

Example 4 (json):
```json
1# Start container and save the container id2CID=$(docker run -d swaggerapi/swagger-generator-v3-minimal)3# allow for startup4sleep 55# Get the IP of the running container6GEN_IP=$(docker inspect --format '{{.NetworkSettings.IPAddress}}'  $CID)7# Execute an HTTP request and store the download link8curl -X POST \9           http://localhost:8080/api/generate \10           -H 'content-type: application/json' \11           -d '{12           "specURL" : "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml",13           "lang" : "jaxrs-jersey",14           "type" : "SERVER",15           "codegenVersion" : "V3"16         }' > result.zip17# Shutdown the swagger generator image18docker stop $CID && docker rm $CID
```

---

## Swagger Codegen Workflow Integration | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/workflow-integration/

**Contents:**
- Swagger Codegen Workflow Integration
- Maven Integration
- Gradle Integration
- GitHub Integration

You can use the swagger-codegen-maven-plugin for integrating with your workflow, and generating any codegen target.

Gradle Swagger Generator Plugin is available for generating source code and API document.

To push the auto-generated SDK to GitHub, we provide git_push.sh to streamline the process. For example:

Create a new repository

**Examples:**

Example 1 (unknown):
```unknown
1 java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate \2 -i modules/swagger-codegen/src/test/resources/2_0/petstore.json -l perl \3 --git-user-id "swaggerapi" \4 --git-repo-id "petstore-perl" \5 --release-note "Github integration demo" \6 -o /var/tmp/perl/petstore
```

Example 2 (unknown):
```unknown
1cd /var/tmp/perl/petstore2/bin/sh ./git_push.sh
```

---

## Swagger Codegen Versioning | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/versioning

**Contents:**
- Swagger Codegen Versioning
- Swagger Codegen 2.X
- Swagger Codegen 3.X

Both 2.X and 3.X version lines of Swagger Codegen are available and are independently maintained.

NOTE: version 2.X (io.swagger) and 3.X (io.swagger.codegen.v3) have different group ids.

**Examples:**

Example 1 (typescript):
```typescript
1<dependency>2    <groupId>io.swagger</groupId>3    <artifactId>swagger-codegen-maven-plugin</artifactId>4    <version>2.4.46</version>5</dependency>
```

Example 2 (typescript):
```typescript
1<dependency>2    <groupId>io.swagger.codegen.v3</groupId>3    <artifactId>swagger-codegen-maven-plugin</artifactId>4    <version>3.0.71</version>5</dependency>
```

---

## Limitations | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-ui/usage/limitations/

**Contents:**
- Limitations
  - Forbidden header names

Some header names cannot be controlled by web applications, due to security features built into web browsers.

Forbidden headers include:

Forbidden header names (developer.mozilla.org)

The biggest impact of this is that OpenAPI 3.0 Cookie parameters cannot be controlled when running Swagger UI in a browser.

For more context, see #3956.

---

## Swagger Codegen Generators Configuration | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/generators-configuration

**Contents:**
- Swagger Codegen Generators Configuration
- Bringing your own models

There are different aspects of customizing the code generator beyond just creating or modifying templates. Each language has a supporting configuration file to handle different type mappings, etc:

Each of these files creates reasonable defaults so you can get running quickly. But if you want to configure package names, prefixes, model folders, etc. you can use a json config file to pass the values.

and config.json contains the following as an example:

Supported config options can be different per language. Running config-help -l {lang} will show available options. These options are applied via configuration file (e.g. config.json) or by passing them with java -jar swagger-codegen-cli.jar -D{optionName}={optionValue}.

If -D{optionName} does not work, please open a ticket and we’ll look into it.

Your config file for Java can look like

For all the unspecified options default values will be used.

Another way to override default options is to extend the config class for the specific language. To change, for example, the prefix for the Objective-C generated files, simply subclass the ObjcClientCodegen.java:

and specify the classname when running the generator:

Your subclass will now be loaded and overrides the PREFIX value in the superclass.

Sometimes you don’t want a model generated. In this case, you can simply specify an import mapping to tell the codegen what not to create. When doing this, every location that references a specific model will refer back to your classes. Note, this may not apply to all languages…

To specify an import mapping, use the --import-mappings argument and specify the model-to-import logic as such:

Or for multiple mappings:

**Examples:**

Example 1 (lua):
```lua
1$ ls -1 modules/swagger-codegen/src/main/java/io/swagger/codegen/languages/2AbstractJavaJAXRSServerCodegen.java3AbstractTypeScriptClientCodegen.java4... (results omitted)5TypeScriptAngularClientCodegen.java6TypeScriptNodeClientCodegen.java
```

Example 2 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate \2  -i https://petstore.swagger.io/v2/swagger.json \3  -l java \4  -o samples/client/petstore/java \5  -c path/to/config.json
```

Example 3 (json):
```json
1{2  "apiPackage" : "petstore"3}
```

Example 4 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar config-help -l java
```

---

## Swagger Codegen Selective Generation | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/generation-selective

**Contents:**
- Swagger Codegen Selective Generation
- Ignore file format

You may not want to generate all models in your project. Likewise you may want just one or two apis to be written. If that’s the case, you can use system properties to control the output:

The default is generate everything supported by the specific library. Once you enable a feature, it will restrict the contents generated:

To control the specific files being generated, you can pass a CSV list of what you want:

To control generation of docs and tests for api and models, pass false to the option. For api, these options are -DapiTests=false and -DapiDocs=false. For models, -DmodelTests=false and -DmodelDocs=false. These options default to true and don’t limit the generation of the feature options listed above (like -Dapi):

When using selective generation, only the templates needed for the specific generation will be used.

Swagger Codegen supports a .swagger-codegen-ignore file, similar to .gitignore or .dockerignore you’re probably already familiar with.

The ignore file allows for better control over overwriting existing files than the --skip-overwrite flag. With the ignore file, you can specify individual files or directories can be ignored. This can be useful, for example if you only want a subset of the generated code.

The .swagger-codegen-ignore file must exist in the root of the output directory.

Upon first code generation, you may also pass the CLI option --ignore-file-override=/path/to/ignore_file for greater control over generated outputs. Note that this is a complete override, and will override the .swagger-codegen-ignore file in an output directory when regenerating code.

Editor support for .swagger-codegen-ignore files is available in IntelliJ via the .ignore plugin.

**Examples:**

Example 1 (unknown):
```unknown
1# generate only models2java -Dmodels {opts}3
4# generate only apis5java -Dapis {opts}6
7# generate only supporting files8java -DsupportingFiles9
10# generate models and supporting files11java -Dmodels -DsupportingFiles
```

Example 2 (sass):
```sass
1# generate the User and Pet models only2-Dmodels=User,Pet3
4# generate the User model and the supportingFile `StringUtil.java`:5-Dmodels=User -DsupportingFiles=StringUtil.java
```

Example 3 (sass):
```sass
1# generate only models (with tests and documentation)2java -Dmodels {opts}3
4# generate only models (with tests but no documentation)5java -Dmodels -DmodelDocs=false {opts}6
7# generate only User and Pet models (no tests and no documentation)8java -Dmodels=User,Pet -DmodelTests=false {opts}9
10# generate only apis (without tests)11java -Dapis -DapiTests=false {opts}12
13# generate only apis (modelTests option is ignored)14java -Dapis -DmodelTests=false {opts}
```

Example 4 (unknown):
```unknown
1# Swagger Codegen Ignore2# Lines beginning with a # are comments3
4# This should match build.sh located anywhere.5build.sh6
7# Matches build.sh in the root8/build.sh9
10# Exclude all recursively11docs/**12
13# Explicitly allow files excluded by other rules14!docs/UserApi.md15
16# Recursively exclude directories named Api17# You can't negate files below this directory.18src/**/Api/19
20# When this file is nested under /Api (excluded above),21# this rule is ignored because parent directory is excluded by previous rule.22!src/**/PetApiTests.cs23
24# Exclude a single, nested file explicitly25src/IO.Swagger.Test/Model/AnimalFarmTests.cs
```

---

## SwaggerEditor | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-editor-next

**Contents:**
- SwaggerEditor
- Anonymized analytics
- Getting started
  - Prerequisites
  - Installation
  - Usage
- Development
  - Prerequisites
  - Setting up
  - npm scripts

SwaggerEditor is using forked Create React App as it’s building infrastructure.

Swagger Editor uses Scarf to collect anonymized installation analytics. These analytics help support the maintainers of this library and ONLY run during installation. To opt out, you can set the scarfSettings.enabled field to false in your project’s package.json:

Alternatively, you can set the environment variable SCARF_ANALYTICS to false as part of the environment that installs your npm packages, e.g., SCARF_ANALYTICS=false npm install.

These prerequisites are required both for installing SwaggerEditor as a npm package and local development setup.

Assuming prerequisites are already installed, SwaggerEditor npm package is installable and works with Node.js >= 12.22.0. You can install SwaggerEditor via npm CLI by running the following command:

NOTE: when using bundler to build your project which is using swagger-editor@5 npm package, you might run into following Node.js error: Reached heap limit Allocation failed - JavaScript heap out of memory. It is caused by significant amount of code that needs to be bundled. This error can be resolved by extending the Node.js max heap limit: export NODE_OPTIONS="--max_old_space_size=4096".

Use the package in you application:

webpack.config.js (webpack@5)

Install dependencies needed for webpack@5 to properly build SwaggerEditor.

Alternative webpack.config.js (webpack@5)

We’ve already built Web Workers fragments for you, and they’re located inside our npm distribution package in dist/umd/ directory. In order to avoid complexity of building the Web Worker fragments you can use those fragments directly. This setup will work both for production and development (webpack-dev-server) and will significantly shorten your build process.

Install copy-webpack-plugin and other needed dependencies.

Assuming prerequisites are already installed, Node.js >=20.3.0 and npm >=9.6.7 are the minimum required versions that this repo runs on, but we recommend using the latest version of Node.js@20.

If you use nvm, running following command inside this repository will automatically pick the right Node.js version for you:

Run the following commands to set up the repository for local development:

Runs unit and integration tests

Runs E2E Cypress tests

Usage in development environment:

Usage in Continuous Integration (CI) environment:

This script will build all the SwaggerEditor build artifacts - app, esm and umd.

After building artifacts, every two new directories will be created: build/ and dist/.

Builds and serves standalone SwaggerEditor application and all it’s assets on http://localhost:3050/.

This bundle is suited for consumption by 3rd parties, which want to use SwaggerEditor as a library in their own applications and have their own build process.

SwaggerEditor UMD bundle exports SwaggerEditor symbol on global object. It’s bundled with React defined as external. This allows consumer to use his own version of React + ReactDOM and mount SwaggerEditor lazily.

SwaggerEditor is released as swagger-editor@5 npm package on npmjs.com. Package can also be produced manually by running following commands (assuming you’re already followed setting up steps):

SwaggerEditor maps its build artifacts in package.json file in following way:

To learn more about these fields please refer to webpack mainFields documentation or to Node.js Modules: Packages documentation.

[!IMPORTANT] By older versions we specifically refer to React >=17 <18.

By default swagger-editor@5 npm package comes with latest version of React@18. It’s possible to use swagger-editor@5 npm package with older version of React.

Let’s say my application integrates with swagger-editor@5 npm package and uses React@17.0.2.

In order to inform swagger-editor@5 npm package that I require it to use my React version, I need to use npm overrides.

[!NOTE] The React and ReactDOM override are defined as a reference to the dependency. Since react-redux@9 only supports React >= 18, we need to use react-redux@8.

In order to inform swagger-editor@5 npm package that I require it to use my specific React version, I need to use yarn resolutions.

[!NOTE] The React and ReactDOM resolution cannot be defined as a reference to the dependency. Unfortunately yarn does not support aliasing like $react or $react-dom as npm does. You’ll need to specify the exact versions.

It is possible to use an environment variable to specify a local JSON/YAML file or a remote URL for SwaggerEditor to load on startup. These environment variables will get baked in during build time into build artifacts.

Environment variables currently available:

Sample environment variable values can be found in .env file. For more information about using environment variables, please refer to adding Custom Environment Variables section of Create React App documentation.

SwaggerEditor comes with number of preview plugins that are responsible for rendering the definition that’s being created in the editor. These plugins include:

With a bit of adapting, we can use these plugins with SwaggerUI to provide ability to render AsyncAPI or API Design Systems definitions with SwaggerUI.

The key here is SwaggerUIAdapter plugin which adapts SwaggerEditor plugins to use directly with SwaggerUI.

SwaggerUI standalone mode is supported as well. With standalone mode you’ll get a TopBar with an input where URL of the definition can be provided and this definition is subsequently loaded by the SwaggerUI.

It’s possible to utilize preview plugins in a build-free way via unpkg.com to create a standalone multi-spec supporting version of SwaggerUI.

SwaggerEditor is just a number of SwaggerUI plugins used with swagger-ui-react. Customized SwaggerEditor can be created by composing individual plugins with either swagger-ui and swagger-ui-react.

List of available plugins:

Individual plugins can be imported in the following way:

Along with plugins, presets are available as well. Preset is a collection of plugins that are design to work together to provide a compound feature.

List of available presets:

Individual presets can be imported in the following way:

NOTE: Please refer to the Plug points documentation of SwaggerUI to understand how presets are passed to SwaggerUI.

SwaggerEditor is available as a pre-built docker image hosted on docker.swagger.io.

Now open your browser at http://localhost:8080/.

Now open your browser at http://localhost:8080/.

No custom environment variables are currently supported by SwaggerEditor.

SwaggerEditor is licensed under Apache 2.0 license. SwaggerEditor comes with an explicit NOTICE file containing additional legal notifications and information.

This project uses REUSE specification that defines a standardized method for declaring copyright and licensing for software projects.

Software Bill Of materials is available in this repository dependency graph. Click on Export SBOM button to download the SBOM in SPDX format.

**Examples:**

Example 1 (lua):
```lua
1{2  // ...3  "scarfSettings": {4    "enabled": false5  }6  // ...7}
```

Example 2 (elixir):
```elixir
1 $ npm install swagger-editor@alpha
```

Example 3 (jsx):
```jsx
1import React from 'react';2import ReactDOM from 'react-dom';3import SwaggerEditor from 'swagger-editor';4import 'swagger-editor/swagger-editor.css';5
6const url = "https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml";7
8const MyApp = () => (9  <div>10    <h1>SwaggerEditor Integration</h1>11    <SwaggerEditor url={url} />12  </div>13);14
15self.MonacoEnvironment = {16  /**17   * We're building into the dist/ folder. When application starts on18   * URL=https://example.com then SwaggerEditor will look for19   * `apidom.worker.js` on https://example.com/dist/apidom.worker.js and20   * `editor.worker` on https://example.com/dist/editor.worker.js.21   */22  baseUrl: `${document.baseURI || location.href}dist/`,23}24
25ReactDOM.render(<MyApp />, document.getElementById('swagger-editor'));
```

Example 4 (unknown):
```unknown
1 $ npm i stream-browserify --save-dev2 $ npm i https-browserify --save-dev3 $ npm i stream-http --save-dev4 $ npm i util --save-dev
```

---

## Swagger Codegen Online Generators | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/online-generators/

**Contents:**
- Swagger Codegen Online Generators

One can also generate API client or server using the online generators (https://generator.swagger.io)

For example, to generate Ruby API client, simply send the following HTTP request using curl:

Then you will receive a JSON response with the URL to download the zipped code.

To customize the SDK, you can POST to https://generator.swagger.io/api/gen/clients/{language} with the following HTTP body:

in which the options for a language can be obtained by submitting a GET request to https://generator.swagger.io/api/gen/clients/{language}:

For example, curl https://generator.swagger.io/api/gen/clients/python returns

To set package name to pet_store, the HTTP body of the request is as follows:

and here is the curl command:

Instead of using swaggerUrl with an URL to the OpenAPI/Swagger spec, one can include the spec in the JSON payload with spec, e.g.

**Examples:**

Example 1 (json):
```json
1curl -X POST -H "content-type:application/json" -d '{"swaggerUrl":"https://petstore.swagger.io/v2/swagger.json"}' https://generator.swagger.io/api/gen/clients/ruby
```

Example 2 (json):
```json
1{2  "options":  {},3  "swaggerUrl": "https://petstore.swagger.io/v2/swagger.json"4}
```

Example 3 (json):
```json
1{2  "packageName": {3    "opt": "packageName",4    "description": "python package name (convention: snake_case).",5    "type": "string",6    "default": "swagger_client"7  },8  "packageVersion": {9    "opt": "packageVersion",10    "description": "python package version.",11    "type": "string",12    "default": "1.0.0"13  },14  "sortParamsByRequiredFlag": {15    "opt": "sortParamsByRequiredFlag",16    "description": "Sort method arguments to place required parameters before optional parameters.",17    "type": "boolean",18    "default": "true"19  }20}
```

Example 4 (json):
```json
1{2  "options": {3    "packageName": "pet_store"4  },5  "swaggerUrl": "https://petstore.swagger.io/v2/swagger.json"6}
```

---

## Swagger Editor Documentation | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-editor/

**Contents:**
- Swagger Editor Documentation
- Using the Editor on the Web
- Running locally
  - Prerequisites
      - Browser support
  - Known Issues
- Helpful scripts
  - Developing
  - Building
  - Testing

This page is about the current Swagger Editor. If you’re looking for Swagger Editor Next (beta) (otherwise known as SwaggerEditor@5) docs, visit Swagger Editor Next (beta).

The Swagger Editor is an open source editor to design, define and document HTTP (RESTful) APIs in the OpenAPI Specification. The source code for the Swagger Editor can be found in GitHub.

GitHub: https://github.com/swagger-api/swagger-editor

Only Swagger Editor Next supports OpenAPI 3.1.0. SwaggerEditor@4 will not receive OpenAPI 3.1.0 support and is considered legacy at this point. The plan is to continually migrate fully to SwaggerEditor@5 and deprecate the SwaggerEditor@4 in the future.

The Editor works in any web browser, and can be hosted locally or accessed from the web.

Take Me To The Web Version

If you have Node.js and npm installed, you can run npm start to spin up a static server.

Otherwise, you can open index.html directly from your filesystem in your browser.

If you’d like to make code changes to Swagger Editor, you can start up a Webpack hot-reloading dev server via npm run dev.

Swagger Editor works in the latest versions of Chrome, Safari, Firefox, and Edge.

To help with the migration, here are the currently known issues with 3.X. This list will update regularly, and will not include features that were not implemented in previous versions.

Any of the scripts below can be run by typing npm run <script name> in the project’s root directory.

There is a docker image published in docker.swagger.io registry.

To use this, run the following:

This will run Swagger Editor (in detached mode) on port 80 on your machine, so you can open it by navigating to http://localhost in your browser.

Note: When both URL and SWAGGER_FILE environment variables are set, URL has priority and SWAGGER_FILE is ignored.

You can also customize the different endpoints used by the Swagger Editor with the following environment variables. For instance, this can be useful if you have your own Swagger generator server:

If you want to run the Swagger Editor locally without the Codegen features (Generate Server and Generate Client) you can set the above environment variables to null (URL_SWAGGER2_CONVERTER=null).

To build and run a docker image with the code checked out on your machine, run the following from the root directory of the project:

You can then view the app by navigating to http://localhost in your browser.

Importing your OpenAPI document

[!IMPORTANT] By older versions we specifically refer to React >=17 <18.

By default swagger-editor@4 npm package comes with latest version of React@18. It’s possible to use swagger-editor@4 npm package with older version of React.

Let’s say my application integrates with swagger-editor@4 npm package and uses React@17.0.2.

In order to inform swagger-editor@4 npm package that I require it to use my React version, I need to use npm overrides.

[!NOTE] The React and ReactDOM override are defined as a reference to the dependency. Since react-redux@9 only supports React >= 18, we need to use react-redux@8.

In order to inform swagger-editor@4 npm package that I require it to use my specific React version, I need to use yarn resolutions.

[!NOTE] The React and ReactDOM resolution cannot be defined as a reference to the dependency. Unfortunately yarn does not support aliasing like $react or $react-dom as npm does. You’ll need to specify the exact versions.

Please disclose any security-related issues or vulnerabilities by emailing security@swagger.io, instead of using the public issue tracker.

Swagger Editor uses Scarf to collect anonymized installation analytics. These analytics help support the maintainers of this library and ONLY run during installation. To opt out, you can set the scarfSettings.enabled field to false in your project’s package.json:

Alternatively, you can set the environment variable SCARF_ANALYTICS to false as part of the environment that installs your npm packages, e.g., SCARF_ANALYTICS=false npm install.

**Examples:**

Example 1 (unknown):
```unknown
1 $ npm i --legacy-peer-deps
```

Example 2 (json):
```json
1docker pull docker.swagger.io/swaggerapi/swagger-editor2docker run -d -p 80:8080 docker.swagger.io/swaggerapi/swagger-editor
```

Example 3 (json):
```json
1docker run -d -p 80:8080 -e URL="https://petstore3.swagger.io/api/v3/openapi.json" docker.swagger.io/swaggerapi/swagger-editor
```

Example 4 (json):
```json
1docker run -d -p 80:8080 -v $(pwd):/tmp -e SWAGGER_FILE=/tmp/swagger.json docker.swagger.io/swaggerapi/swagger-editor
```

---

## CORS | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-ui/usage/cors/

**Contents:**
- CORS
  - Testing CORS Support
  - Enabling CORS
  - CORS and Header Parameters

CORS is a technique to prevent websites from doing bad things with your personal data. Most browsers + JavaScript toolkits not only support CORS but enforce it, which has implications for your API server which supports Swagger.

You can read about CORS here: http://www.w3.org/TR/cors.

There are two cases where no action is needed for CORS support:

Otherwise, CORS support needs to be enabled for:

You can verify CORS support with one of three techniques:

This tells us that the petstore resource listing supports OPTIONS, and the following headers: Content-Type, api_key, Authorization.

Swagger UI cannot easily show this error state.

The method of enabling CORS depends on the server and/or framework you use to host your application. https://enable-cors.org provides information on how to enable CORS in some common web servers.

Other servers/frameworks may provide you information on how to enable it specifically in their use case.

Swagger UI lets you easily send headers as parameters to requests. The name of these headers MUST be supported in your CORS configuration as well. From our example above:

Only headers with these names will be allowed to be sent by Swagger UI.

**Examples:**

Example 1 (vue):
```vue
1$ curl -I "https://petstore.swagger.io/v2/swagger.json"2HTTP/1.1 200 OK3Date: Sat, 31 Jan 2015 23:05:44 GMT4Access-Control-Allow-Origin: *5Access-Control-Allow-Methods: GET, POST, DELETE, PUT, PATCH, OPTIONS6Access-Control-Allow-Headers: Content-Type, api_key, Authorization7Content-Type: application/json8Content-Length: 0
```

Example 2 (unknown):
```unknown
1XMLHttpRequest cannot load http://sad.server.com/v2/api-docs. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
```

Example 3 (unknown):
```unknown
1Access-Control-Allow-Headers: Content-Type, api_key, Authorization
```

---

## Installation | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/

**Contents:**
- Installation
- Distribution channels
  - NPM Registry
  - Installation
  - Docker
  - unpkg
  - Static files without HTTP or HTML
- Plain old HTML/CSS/JS (Standalone)

We publish three modules to npm: swagger-ui, swagger-ui-dist and swagger-ui-react.

swagger-ui is meant for consumption by JavaScript web projects that include module bundlers, such as Webpack, Browserify, and Rollup. Its main file exports Swagger UI’s main function, and the module also includes a namespaced stylesheet at swagger-ui/dist/swagger-ui.css. Here’s an example:

You can now install SwaggerUI packages using npm:

See the Webpack Getting Started sample for details.

In contrast, swagger-ui-dist is meant for server-side projects that need assets to serve to clients. The module, when imported, includes an absolutePath helper function that returns the absolute filesystem path to where the swagger-ui-dist module is installed.

Note: we suggest using swagger-ui when your tooling makes it possible, as swagger-ui-dist will result in more code going across the wire.

The module’s contents mirror the dist folder you see in the Git repository. The most useful file is swagger-ui-bundle.js, which is a build of Swagger UI that includes all the code it needs to run in one file. The folder also has an index.html asset, to make it easy to serve Swagger UI like so:

The module also exports SwaggerUIBundle and SwaggerUIStandalonePreset, so if you’re in a JavaScript project that can’t handle a traditional npm module, you could do something like this:

SwaggerUIBundle is equivalent to SwaggerUI.

You can pull a pre-built docker image of the swagger-ui directly from docker.swagger.io:

Will start nginx with Swagger UI on port 80.

Or you can provide your own swagger.json on your host

You can also provide a URL to a swagger.json on an external host:

The base URL of the web application can be changed by specifying the BASE_URL environment variable:

This will serve Swagger UI at /swagger instead of /.

You can specify a different port via PORT variable for accessing the application, default is 8080.

You can specify an IPv6 port via PORT_IPV6 variable. By default, IPv6 port is not set.

You can allow/disallow embedding via EMBEDDING variable. By default, embedding is disabled.

For more information on controlling Swagger UI through the Docker image, see the Docker section of the Configuration documentation.

You can embed Swagger UI’s code directly in your HTML by using unpkg’s interface:

Using StandalonePreset will render TopBar and ValidatorBadge as well.

See unpkg’s main page for more information on how to use unpkg.

Once swagger-ui has successfully generated the /dist directory, you can copy this to your own file system and host from there.

The folder /dist includes all the HTML, CSS and JS files needed to run SwaggerUI on a static website or CMS, without requiring NPM.

**Examples:**

Example 1 (unknown):
```unknown
1 $ npm install swagger-ui
```

Example 2 (unknown):
```unknown
1 $ npm install swagger-ui-react
```

Example 3 (unknown):
```unknown
1 $ npm install swagger-ui-dist
```

Example 4 (elixir):
```elixir
1import SwaggerUI from 'swagger-ui'2// or use require if you prefer3const SwaggerUI = require('swagger-ui')4
5SwaggerUI({6  dom_id: '#myDomId'7})
```

---

## Swagger Codegen Workflow Integration | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/workflow-integration/

**Contents:**
- Swagger Codegen Workflow Integration
- Maven Integration
- Gradle Integration
- GitHub Integration

You can use the swagger-codegen-maven-plugin for integrating with your workflow, and generating any codegen target.

Gradle Swagger Generator Plugin is available for generating source code and API document.

To push the auto-generated SDK to GitHub, we provide git_push.sh to streamline the process. For example:

Create a new repository in GitHub (Ref: https://help.github.com/articles/creating-a-new-repository/)

**Examples:**

Example 1 (unknown):
```unknown
1 java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate \2 -i modules/swagger-codegen/src/test/resources/2_0/petstore.json -l perl \3 --git-user-id "swaggerapi" \4 --git-repo-id "petstore-perl" \5 --release-note "Github integration demo" \6 -o /var/tmp/perl/petstore
```

Example 2 (unknown):
```unknown
1cd /var/tmp/perl/petstore2/bin/sh ./git_push.sh
```

---

## Helpful scripts | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-ui/development/scripts/

**Contents:**
- Helpful scripts
  - Developing
  - Building
  - Testing

Any of the scripts below can be run by typing npm run <script name> in the project’s root directory.

---

## Swagger Codegen | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/about/

**Contents:**
- Swagger Codegen
- Versioning
- Supported Languages and Frameworks
- Compatibility
  - Getting Started
- Generators
  - To generate a sample client library
  - Generating libraries from your server
  - Selective generation
  - Advanced Generator Customization

This is the Swagger Codegen project, which allows generation of API client libraries (SDK generation), server stubs and documentation automatically given an OpenAPI Spec.

💚 If you would like to contribute, please refer to guidelines and a list of open tasks.💚

📔 For more information, please refer to the Wiki page and FAQ 📔

⚠️ If the OpenAPI Description or Swagger file is obtained from an untrusted source, please make sure you’ve reviewed the artefact before using Swagger Codegen to generate the API client, server stub or documentation as code injection may occur. ⚠️

⚠️ this document refers to version 2.X, check here for 3.X.

Both 2.X and 3.X version lines of Swagger Codegen are available and are independently maintained.

For full versioning information, please refer to the versioning documentation.

Currently, the following languages/frameworks are supported:

Check out OpenAPI-Spec for additional information about the OpenAPI project.

The OpenAPI Specification has undergone 3 revisions since initial creation in 2010. The current stable versions of Swagger Codegen project have the following compatibilities with the OpenAPI Specification:

💁 Here’s also an overview of what’s coming around the corner:

For detailed breakdown of all versions, please see the full compatibility listing.

To get up and running with Swagger Codegen, check out the following guides and instructions:

Once you’ve your environment setup, you’re ready to start generating clients and/or servers.

As a quick example, to generate a PHP client for https://petstore.swagger.io/v2/swagger.json, you can run the following:

Note: if you’re on Windows, replace the last command with

You can also download the JAR (latest release) directly from maven.org

To get a list of general options available, you can run the following:

To get a list of PHP specified options (which can be passed to the generator with a config file via the -c option), please run

You can build a client against the swagger sample petstore API as follows:

(On Windows, run .\bin\windows\java-petstore.bat instead)

This will run the generator with this command:

with a number of options. You can get the options with the help generate command (below only shows partial results):

You can then compile and run the client, as well as unit tests against it:

Other languages have petstore samples, too:

It’s just as easy—just use the -i flag to point to either a server or file.

🔧 Swagger Codegen comes with a tonne of flexibility to support your code generation preferences. Checkout the generators documentation which takes you through some of the possibilities as well as showcasing how to generate from local files and ignore file formats.

You may not want to generate all models in your project. Likewise you may want just one or two apis to be written. If that’s the case check the selective generation instructions.

There are different aspects of customizing the code generator beyond just creating or modifying templates. Each language has a supporting configuration file to handle different type mappings, or bring your own models. For more information check out the advanced configuration docs.

You have options. The easiest is to use our online validator which not only will let you validate your spec, but with the debug flag, you can see what’s wrong with your spec. For example check out Swagger Validator.

If you want to have validation directly on your own machine, then Spectral is an excellent option.

To do so, just use the -l dynamic-html flag when reading a spec file. This creates HTML documentation that is available as a single-page application with AJAX. To view the documentation:

Which launches a node.js server so the AJAX calls have a place to go.

To do so, just use the -l html flag when reading a spec file. This creates a single, simple HTML file with embedded css so you can ship it as an email attachment, or load it from your filesystem:

It’s possible to leverage Swagger Codegen directly within your preferred CI/CD workflows to streamline your auto-generation requirements. Check out the workflows integration guide to see information on our Maven, Gradle, and GitHub integration options. 🚀

If you don’t want to run and host your own code generation instance, check our our online generators information.

Please refer to this page

Please disclose any security-related issues or vulnerabilities by emailing security@swagger.io, instead of using the public issue tracker.

💚💚💚 We’d like to give a big shout out to all those who’ve contributed to Swagger Codegen, be that in raising issues, fixing bugs, authoring templates, or crafting useful content for others to benefit from. 💚💚💚

**Examples:**

Example 1 (unknown):
```unknown
1git clone https://github.com/swagger-api/swagger-codegen2cd swagger-codegen3mvn clean package4java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate \5   -i https://petstore.swagger.io/v2/swagger.json \6   -l php \7   -o /var/tmp/php_api_client
```

Example 2 (unknown):
```unknown
1java -jar modules\swagger-codegen-cli\target\swagger-codegen-cli.jar generate -i https://petstore.swagger.io/v2/swagger.json -l php -o c:\temp\php_api_client
```

Example 3 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar help generate
```

Example 4 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar config-help -l php
```

---

## Swagger Codegen Using Docker | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/docker/

**Contents:**
- Swagger Codegen Using Docker
- Development in docker
- Standalone generator Development in docker
- Run Docker in Vagrant
- Public Pre-built Docker images
  - Swagger Generator Docker Image
  - Swagger Generator “Minimal” Docker Image
  - Swagger Codegen CLI Docker Image

You can use run-in-docker.sh to do all development. This script maps your local repository to /gen in the docker container. It also maps ~/.m2/repository to the appropriate container location.

To execute mvn package:

Build artifacts are now accessible in your working directory.

Once built, run-in-docker.sh will act as an executable for swagger-codegen-cli. To generate code, you’ll need to output to a directory under /gen (e.g. /gen/out). For example:

See standalone generator development

Prerequisite: install Vagrant and VirtualBox.

The Swagger Generator image provides a ready to use web application (swagger-generator) providing code generation services.

Image accepts the following env variables:

An example of running the container:

docker pull swaggerapi/swagger-generator-v3

docker run -e "HIDDEN_OPTIONS=servers:foo,bar|clientsV3:fgf,sdsd" -e "JAVA_MEM=1024m" -e "HTTP_PORT=80" -p 80:80 --name swagger-generator-v3 -v /tmp:/jetty_home/lib/shared swaggerapi/swagger-generator-v3

docker run -e "HIDDEN_OPTIONS_PATH=/hiddenOptions.yaml" -e "JAVA_MEM=1024m" -e "HTTP_PORT=80" -p 80:80 --name swagger-generator-v3 -v /tmp:/jetty_home/lib/shared swaggerapi/swagger-generator-v3

This docker image supports custom generators by dropping the generator jar into /jetty_home/lib/shared directory (typically via a docker volume); e.g having on host /my/custom/coolgenerator.jar and /my/custom/weirdgenerator.jar the following would have them added to generator service generators:

docker run -e "HIDDEN_OPTIONS_PATH=/hiddenOptions.yaml" -e "JAVA_MEM=1024m" -e "HTTP_PORT=80" -p 80:80 --name swagger-generator-v3 -v /my/custom:/jetty_home/lib/shared swaggerapi/swagger-generator-v3

Please note that up to version 3.0.20 you need to provide-v /{WHATEVER_DIR}:/jetty_home/lib/shared even if not using custom generators.

See also online generators.

The Swagger Generator “Minimal” image can act as a self-hosted web application and API for generating code.

This container can be incorporated into a CI pipeline, and requires some docker orchestration to access generated code.

In the example above, result.zip will contain the generated client.

See also online generators.

The Swagger Codegen image acts as a standalone executable. It can be used as an alternative to installing via homebrew, or for developers who are unable to install Java or upgrade the installed version.

To generate code with this image, you’ll need to mount a local location as a volume.

The generated code will be located under ./out/go in the current directory.

**Examples:**

Example 1 (unknown):
```unknown
1git clone https://github.com/swagger-api/swagger-codegen2cd swagger-codegen3./run-in-docker.sh mvn package
```

Example 2 (sass):
```sass
1./run-in-docker.sh help # Executes 'help' command for swagger-codegen-cli2./run-in-docker.sh langs # Executes 'langs' command for swagger-codegen-cli3./run-in-docker.sh /gen/bin/go-petstore.sh  # Builds the Go client4./run-in-docker.sh generate -i modules/swagger-codegen/src/test/resources/2_0/petstore.yaml \5    -l go -o /gen/out/go-petstore -DpackageName=petstore # generates go client, outputs locally to ./out/go-petstore
```

Example 3 (unknown):
```unknown
1git clone http://github.com/swagger-api/swagger-codegen.git2cd swagger-codegen3vagrant up4vagrant ssh5cd /vagrant6./run-in-docker.sh mvn package
```

Example 4 (json):
```json
1# Start container and save the container id2CID=$(docker run -d swaggerapi/swagger-generator-v3-minimal)3# allow for startup4sleep 55# Get the IP of the running container6GEN_IP=$(docker inspect --format '{{.NetworkSettings.IPAddress}}'  $CID)7# Execute an HTTP request and store the download link8curl -X POST \9           http://localhost:8080/api/generate \10           -H 'content-type: application/json' \11           -d '{12           "specURL" : "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml",13           "lang" : "jaxrs-jersey",14           "type" : "SERVER",15           "codegenVersion" : "V3"16         }' > result.zip17# Shutdown the swagger generator image18docker stop $CID && docker rm $CID
```

---

## Swagger Codegen Building | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/building/

**Contents:**
- Swagger Codegen Building
- Homebrew
- To build a server stub
- To build the codegen library

After cloning the project, you can build it from source with this command:

If you don’t have maven installed, you may directly use the included maven wrapper, and build with the command:

To install, run brew install swagger-codegen

Here is an example usage:

Please refer to https://github.com/swagger-api/swagger-codegen/wiki/Server-stub-generator-HOWTO for more information.

This will create the Swagger Codegen library from source.

Note! The templates are included in the library generated. If you want to modify the templates, you’ll need to either repackage the library OR specify a path to your scripts.

**Examples:**

Example 1 (unknown):
```unknown
1mvn clean package
```

Example 2 (unknown):
```unknown
1./mvnw clean package
```

Example 3 (unknown):
```unknown
1swagger-codegen generate -i https://petstore.swagger.io/v2/swagger.json -l ruby -o /tmp/test/
```

Example 4 (unknown):
```unknown
1mvn package
```

---

## Swagger Codegen Selective Generation | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/generation-selective/

**Contents:**
- Swagger Codegen Selective Generation

You may not want to generate all models in your project. Likewise you may want just one or two apis to be written. If that’s the case, you can use system properties to control the output:

The default is generate everything supported by the specific library. Once you enable a feature, it will restrict the contents generated:

To control the specific files being generated, you can pass a CSV list of what you want:

To control generation of docs and tests for api and models, pass false to the option. For api, these options are -DapiTests=false and -DapiDocs=false. For models, -DmodelTests=false and -DmodelDocs=false. These options default to true and don’t limit the generation of the feature options listed above (like -Dapi):

When using selective generation, only the templates needed for the specific generation will be used.

**Examples:**

Example 1 (unknown):
```unknown
1# generate only models2java -Dmodels {opts}3
4# generate only apis5java -Dapis {opts}6
7# generate only supporting files8java -DsupportingFiles9
10# generate models and supporting files11java -Dmodels -DsupportingFiles
```

Example 2 (sass):
```sass
1# generate the User and Pet models only2-Dmodels=User,Pet3
4# generate the User model and the supportingFile `StringUtil.java`:5-Dmodels=User -DsupportingFiles=StringUtil.java
```

Example 3 (sass):
```sass
1# generate only models (with tests and documentation)2java -Dmodels {opts}3
4# generate only models (with tests but no documentation)5java -Dmodels -DmodelDocs=false {opts}6
7# generate only User and Pet models (no tests and no documentation)8java -Dmodels=User,Pet -DmodelTests=false {opts}9
10# generate only apis (without tests)11java -Dapis -DapiTests=false {opts}12
13# generate only apis (modelTests option is ignored)14java -Dapis -DmodelTests=false {opts}
```

---

## Plugins | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-ui/customization/plugin-api/

**Contents:**
- Plugins
  - Note: Semantic Versioning
  - Format
  - System is provided to plugins
  - Interfaces
    - Actions
    - Reducers
    - Selectors
    - Components
    - Wrap-Actions

A plugin is a function that returns an object - more specifically, the object may contain functions and components that augment and modify Swagger UI’s functionality.

Swagger UI’s internal APIs are not part of our public contract, which means that they can change without the major version change.

If your custom plugins wrap, extend, override, or consume any internal core APIs, we recommend specifying a specific minor version of Swagger UI to use in your application, because they will not change between patch versions.

If you’re installing Swagger UI via NPM, for example, you can do this by using a tilde:

A plugin return value may contain any of these keys, where stateKey is a name for a piece of state:

Let’s assume we have a plugin, NormalPlugin, that exposes a doStuff action under the normal state namespace.

As you can see, each plugin is passed a reference to the system being built up. As long as NormalPlugin is compiled before ExtendingPlugin, this will work without any issues.

There is no dependency management built into the plugin system, so if you create a plugin that relies on another, it is your responsibility to make sure that the dependent plugin is loaded after the plugin being depended on.

Once an action has been defined, you can use it anywhere that you can get a system reference:

The Action interface enables the creation of new Redux action creators within a piece of state in the Swagger UI system.

This action creator function will be exposed to container components as exampleActions.updateFavoriteColor. When this action creator is called, the return value (which should be a Flux Standard Action) will be passed to the example reducer, which we’ll define in the next section.

For more information about the concept of actions in Redux, see the Redux Actions documentation.

Reducers take a state (which is an Immutable.js map) and an action, then returns a new state.

Reducers must be provided to the system under the name of the action type that they handle, in this case, EXAMPLE_SET_FAV_COLOR.

Selectors reach into their namespace’s state to retrieve or derive data from the state.

They’re an easy way to keep logic in one place, and are preferred over passing state data directly into components.

You can also use the Reselect library to memoize your selectors, which is recommended for any selectors that will see heavy use, since Reselect automatically memoizes selector calls for you:

Once a selector has been defined, you can use it anywhere that you can get a system reference:

You can provide a map of components to be integrated into the system.

Be mindful of the key names for the components you provide, as you’ll need to use those names to refer to the components elsewhere.

You can also “cancel out” any components that you don’t want by creating a stateless component that always returns null:

You can use config.failSilently if you don’t want a warning when a component doesn’t exist in the system.

Be mindful of getComponent arguments order. In the example below, the boolean false refers to presence of a container, and the 3rd argument is the config object used to suppress the missing component warning.

Wrap Actions allow you to override the behavior of an action in the system.

They are function factories with the signature (oriAction, system) => (...args) => result.

A Wrap Action’s first argument is oriAction, which is the action being wrapped. It is your responsibility to call the oriAction - if you don’t, the original action will not fire!

This mechanism is useful for conditionally overriding built-in behaviors, or listening to actions.

Wrap Selectors allow you to override the behavior of a selector in the system.

They are function factories with the signature (oriSelector, system) => (state, ...args) => result.

This interface is useful for controlling what data flows into components. We use this in the core code to disable selectors based on the API definition’s version.

Wrap Components allow you to override a component registered within the system.

Wrap Components are function factories with the signature (OriginalComponent, system) => props => ReactElement. If you’d prefer to provide a React component class, (OriginalComponent, system) => ReactClass works as well.

Here’s another example that includes a code sample of a component that will be wrapped:

The rootInjects interface allows you to inject values at the top level of the system.

This interface takes an object, which will be merged in with the top-level system object at runtime.

The afterLoad plugin method allows you to get a reference to the system after your plugin has been registered.

This interface is used in the core code to attach methods that are driven by bound selectors or actions. You can also use it to execute logic that requires your plugin to already be ready, for example fetching initial data from a remote endpoint and passing it to an action your plugin creates.

The plugin context, which is bound to this, is undocumented, but below is an example of how to attach a bound action as a top-level method:

The fn interface allows you to add helper functions to the system for use elsewhere.

**Examples:**

Example 1 (json):
```json
1{2  "dependencies": {3    "swagger-ui": "~3.11.0"4  }5}
```

Example 2 (scala):
```scala
1{2  statePlugins: {3    [stateKey]: {4      actions,5      reducers,6      selectors,7      wrapActions,8      wrapSelectors9    }10  },11  components: {},12  wrapComponents: {},13  rootInjects: {},14  afterLoad: (system) => {},15  fn: {},16}
```

Example 3 (lua):
```lua
1const ExtendingPlugin = function(system) {2  return {3    statePlugins: {4      extending: {5        actions: {6          doExtendedThings: function(...args) {7            // you can do other things in here if you want8            return system.normalActions.doStuff(...args)9          }10        }11      }12    }13  }14}
```

Example 4 (scala):
```scala
1const MyActionPlugin = () => {2  return {3    statePlugins: {4      example: {5        actions: {6          updateFavoriteColor: (str) => {7            return {8              type: "EXAMPLE_SET_FAV_COLOR",9              payload: str10            }11          }12        }13      }14    }15  }16}
```

---

## Creating a custom layout | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-ui/customization/custom-layout/

**Contents:**
- Creating a custom layout
  - Augmenting the default layout

Layouts are a special type of component that Swagger UI uses as the root component for the entire application. You can define custom layouts in order to have high-level control over what ends up on the page.

By default, Swagger UI uses BaseLayout, which is built into the application. You can specify a different layout to be used by passing the layout’s name as the layout parameter to Swagger UI. Be sure to provide your custom layout as a component to Swagger UI.

For example, if you wanted to create a custom layout that only displayed operations, you could define an OperationsLayout:

If you’d like to build around the BaseLayout instead of replacing it, you can pull the BaseLayout into your custom layout and use it:

**Examples:**

Example 1 (jsx):
```jsx
1import React from "react"2
3// Create the layout component4class OperationsLayout extends React.Component {5  render() {6    const {7      getComponent8    } = this.props9
10    const Operations = getComponent("operations", true)11
12    return (13      <div className="swagger-ui">14        <Operations />15      </div>16    )17  }18}19
20// Create the plugin that provides our layout component21const OperationsLayoutPlugin = () => {22  return {23    components: {24      OperationsLayout: OperationsLayout25    }26  }27}28
29// Provide the plugin to Swagger-UI, and select OperationsLayout30// as the layout for Swagger-UI31SwaggerUI({32  url: "https://petstore.swagger.io/v2/swagger.json",33  plugins: [ OperationsLayoutPlugin ],34  layout: "OperationsLayout"35})
```

Example 2 (jsx):
```jsx
1import React from "react"2
3// Create the layout component4class AugmentingLayout extends React.Component {5  render() {6    const {7      getComponent8    } = this.props9
10    const BaseLayout = getComponent("BaseLayout", true)11
12    return (13      <div>14        <div className="myCustomHeader">15          <h1>I have a custom header above Swagger-UI!</h1>16        </div>17        <BaseLayout />18      </div>19    )20  }21}22
23// Create the plugin that provides our layout component24const AugmentingLayoutPlugin = () => {25  return {26    components: {27      AugmentingLayout: AugmentingLayout28    }29  }30}31
32// Provide the plugin to Swagger-UI, and select AugmentingLayout33// as the layout for Swagger-UI34SwaggerUI({35  url: "https://petstore.swagger.io/v2/swagger.json",36  plugins: [ AugmentingLayoutPlugin ],37  layout: "AugmentingLayout"38})
```

---

## Swagger Codegen Versioning | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/versioning/

**Contents:**
- Swagger Codegen Versioning
- Swagger Codegen 2.X
- Swagger Codegen 3.X

Both 2.X and 3.X version lines of Swagger Codegen are available and are independently maintained.

NOTE: version 2.X (io.swagger) and 3.X (io.swagger.codegen.v3) have different group ids.

**Examples:**

Example 1 (typescript):
```typescript
1<dependency>2    <groupId>io.swagger</groupId>3    <artifactId>swagger-codegen-maven-plugin</artifactId>4    <version>2.4.46</version>5</dependency>
```

Example 2 (typescript):
```typescript
1<dependency>2    <groupId>io.swagger.codegen.v3</groupId>3    <artifactId>swagger-codegen-maven-plugin</artifactId>4    <version>3.0.71</version>5</dependency>
```

---

## Swagger Codegen Versioning | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/versioning

**Contents:**
- Swagger Codegen Versioning
- Swagger Codegen 2.X
- Swagger Codegen 3.X

Both 2.X and 3.X version lines of Swagger Codegen are available and are independently maintained.

NOTE: version 2.X (io.swagger) and 3.X (io.swagger.codegen.v3) have different group ids.

**Examples:**

Example 1 (typescript):
```typescript
1<dependency>2    <groupId>io.swagger</groupId>3    <artifactId>swagger-codegen-maven-plugin</artifactId>4    <version>2.4.46</version>5</dependency>
```

Example 2 (typescript):
```typescript
1<dependency>2    <groupId>io.swagger.codegen.v3</groupId>3    <artifactId>swagger-codegen-maven-plugin</artifactId>4    <version>3.0.71</version>5</dependency>
```

---

## Swagger Codegen Online Generators | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/online-generators

**Contents:**
- Swagger Codegen Online Generators

One can also generate API client or server using the online generators (https://generator.swagger.io)

For example, to generate Ruby API client, simply send the following HTTP request using curl:

Then you will receive a JSON response with the URL to download the zipped code.

To customize the SDK, you can POST to https://generator.swagger.io/api/gen/clients/{language} with the following HTTP body:

in which the options for a language can be obtained by submitting a GET request to https://generator.swagger.io/api/gen/clients/{language}:

For example, curl https://generator.swagger.io/api/gen/clients/python returns

To set package name to pet_store, the HTTP body of the request is as follows:

and here is the curl command:

Instead of using swaggerUrl with an URL to the OpenAPI/Swagger spec, one can include the spec in the JSON payload with spec, e.g.

**Examples:**

Example 1 (json):
```json
1curl -X POST -H "content-type:application/json" -d '{"swaggerUrl":"https://petstore.swagger.io/v2/swagger.json"}' https://generator.swagger.io/api/gen/clients/ruby
```

Example 2 (json):
```json
1{2  "options":  {},3  "swaggerUrl": "https://petstore.swagger.io/v2/swagger.json"4}
```

Example 3 (json):
```json
1{2  "packageName": {3    "opt": "packageName",4    "description": "python package name (convention: snake_case).",5    "type": "string",6    "default": "swagger_client"7  },8  "packageVersion": {9    "opt": "packageVersion",10    "description": "python package version.",11    "type": "string",12    "default": "1.0.0"13  },14  "sortParamsByRequiredFlag": {15    "opt": "sortParamsByRequiredFlag",16    "description": "Sort method arguments to place required parameters before optional parameters.",17    "type": "boolean",18    "default": "true"19  }20}
```

Example 4 (json):
```json
1{2  "options": {3    "packageName": "pet_store"4  },5  "swaggerUrl": "https://petstore.swagger.io/v2/swagger.json"6}
```

---

## Swagger Codegen Prerequisites | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/prerequisites

**Contents:**
- Swagger Codegen Prerequisites
- OS X Users

If you’re looking for the latest stable version, you can grab it directly from Maven.org (Java 8 runtime at a minimum):

For Windows users, you will need to install wget or you can use Invoke-WebRequest in PowerShell (3.0+). For example:

On a Mac, it’s even easier with brew:

To build from source, you need the following installed and available in your $PATH:

Don’t forget to install Java 11.

Export JAVA_HOME in order to use the supported Java version:

**Examples:**

Example 1 (unknown):
```unknown
1wget https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.71/swagger-codegen-cli-3.0.71.jar -O swagger-codegen-cli.jar2
3java -jar swagger-codegen-cli.jar --help
```

Example 2 (unknown):
```unknown
1Invoke-WebRequest -OutFile swagger-codegen-cli.jar https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.71/swagger-codegen-cli-3.0.71.jar
```

Example 3 (unknown):
```unknown
1brew install swagger-codegen
```

Example 4 (bash):
```bash
1export JAVA_HOME=`/usr/libexec/java_home -v 11`2export PATH=${JAVA_HOME}/bin:$PATH
```

---

## Swagger Codegen Generators | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/generators/

**Contents:**
- Swagger Codegen Generators
- Modifying the client library format
- Making your own codegen modules
- Generating a client from local files
- Ignore file format

If the default generator configuration does not meet your needs, you have various options to modify or create new modules or templates.

Don’t like the default swagger client syntax? Want a different language supported? No problem! Swagger Codegen processes mustache templates with the jmustache engine. You can modify our templates or make your own.

You can look at modules/swagger-codegen/src/main/resources/${your-language} for examples. To make your own templates, create your own files and use the -t flag to specify your template folder. It actually is that easy.

If you’re starting a project with a new language and don’t see what you need, Swagger Codegen can help you create a project to generate your own libraries:

This will write, in the folder output/myLibrary, all the files you need to get started, including a README.md. Once modified and compiled, you can load your library with the codegen and generate clients with your own, custom-rolled logic.

You would then compile your library in the output/myLibrary folder with mvn package and execute the codegen like such:

For Windows users, you will need to use ; instead of : in the classpath, e.g.:

Note the myClientCodegen is an option now, and you can use the usual arguments for generating your library:

See also standalone generator development.

If you don’t want to call your server, you can save the OpenAPI Spec files into a directory and pass an argument to the code generator like this:

Great for creating libraries on your ci server, from the Swagger Editor… or while coding on an airplane ✈️.

Swagger Codegen supports a .swagger-codegen-ignore file, similar to .gitignore or .dockerignore you’re probably already familiar with.

The ignore file allows for better control over overwriting existing files than the --skip-overwrite flag. With the ignore file, you can specify individual files or directories can be ignored. This can be useful, for example if you only want a subset of the generated code.

The .swagger-codegen-ignore file must exist in the root of the output directory.

Upon first code generation, you may also pass the CLI option --ignore-file-override=/path/to/ignore_file for greater control over generated outputs. Note that this is a complete override, and will override the .swagger-codegen-ignore file in an output directory when regenerating code.

Editor support for .swagger-codegen-ignore files is available in IntelliJ via the .ignore plugin.

**Examples:**

Example 1 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar meta \2  -o output/myLibrary -n myClientCodegen -p com.my.company.codegen
```

Example 2 (unknown):
```unknown
1java -cp output/myLibrary/target/myClientCodegen-swagger-codegen-1.0.0.jar:modules/swagger-codegen-cli/target/swagger-codegen-cli.jar io.swagger.codegen.SwaggerCodegen
```

Example 3 (unknown):
```unknown
1java -cp output/myLibrary/target/myClientCodegen-swagger-codegen-1.0.0.jar;modules/swagger-codegen-cli/target/swagger-codegen-cli.jar io.swagger.codegen.SwaggerCodegen
```

Example 4 (unknown):
```unknown
1java -cp output/myLibrary/target/myClientCodegen-swagger-codegen-1.0.0.jar:modules/swagger-codegen-cli/target/swagger-codegen-cli.jar \2  io.swagger.codegen.SwaggerCodegen generate -l myClientCodegen\3  -i https://petstore.swagger.io/v2/swagger.json \4  -o myClient
```

---

## Swagger Codegen Generators | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/generators

**Contents:**
- Swagger Codegen Generators
- Modifying the client library format
- Making your own codegen modules
- Generating a client from local files
- Ignore file format

If the default generator configuration does not meet your needs, you have various options to modify or create new modules or templates.

Don’t like the default swagger client syntax? Want a different language supported? No problem! Swagger Codegen processes mustache templates with the jmustache engine. You can modify our templates or make your own.

You can look at modules/swagger-codegen/src/main/resources/${your-language} for examples. To make your own templates, create your own files and use the -t flag to specify your template folder. It actually is that easy.

If you’re starting a project with a new language and don’t see what you need, Swagger Codegen can help you create a project to generate your own libraries:

This will write, in the folder output/myLibrary, all the files you need to get started, including a README.md. Once modified and compiled, you can load your library with the codegen and generate clients with your own, custom-rolled logic.

You would then compile your library in the output/myLibrary folder with mvn package and execute the codegen like such:

For Windows users, you will need to use ; instead of : in the classpath, e.g.:

Note the myClientCodegen is an option now, and you can use the usual arguments for generating your library:

See also standalone generator development.

If you don’t want to call your server, you can save the OpenAPI Spec files into a directory and pass an argument to the code generator like this:

Great for creating libraries on your ci server, from the Swagger Editor… or while coding on an airplane ✈️.

Swagger Codegen supports a .swagger-codegen-ignore file, similar to .gitignore or .dockerignore you’re probably already familiar with.

The ignore file allows for better control over overwriting existing files than the --skip-overwrite flag. With the ignore file, you can specify individual files or directories can be ignored. This can be useful, for example if you only want a subset of the generated code.

The .swagger-codegen-ignore file must exist in the root of the output directory.

Upon first code generation, you may also pass the CLI option --ignore-file-override=/path/to/ignore_file for greater control over generated outputs. Note that this is a complete override, and will override the .swagger-codegen-ignore file in an output directory when regenerating code.

Editor support for .swagger-codegen-ignore files is available in IntelliJ via the .ignore plugin.

**Examples:**

Example 1 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar meta \2  -o output/myLibrary -n myClientCodegen -p com.my.company.codegen
```

Example 2 (unknown):
```unknown
1java -cp output/myLibrary/target/myClientCodegen-swagger-codegen-1.0.0.jar:modules/swagger-codegen-cli/target/swagger-codegen-cli.jar io.swagger.codegen.SwaggerCodegen
```

Example 3 (unknown):
```unknown
1java -cp output/myLibrary/target/myClientCodegen-swagger-codegen-1.0.0.jar;modules/swagger-codegen-cli/target/swagger-codegen-cli.jar io.swagger.codegen.SwaggerCodegen
```

Example 4 (unknown):
```unknown
1java -cp output/myLibrary/target/myClientCodegen-swagger-codegen-1.0.0.jar:modules/swagger-codegen-cli/target/swagger-codegen-cli.jar \2  io.swagger.codegen.SwaggerCodegen generate -l myClientCodegen\3  -i https://petstore.swagger.io/v2/swagger.json \4  -o myClient
```

---

## Swagger Codegen Versioning | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/versioning/

**Contents:**
- Swagger Codegen Versioning
- Swagger Codegen 2.X
- Swagger Codegen 3.X

Both 2.X and 3.X version lines of Swagger Codegen are available and are independently maintained.

NOTE: version 2.X (io.swagger) and 3.X (io.swagger.codegen.v3) have different group ids.

**Examples:**

Example 1 (typescript):
```typescript
1<dependency>2    <groupId>io.swagger</groupId>3    <artifactId>swagger-codegen-maven-plugin</artifactId>4    <version>2.4.46</version>5</dependency>
```

Example 2 (typescript):
```typescript
1<dependency>2    <groupId>io.swagger.codegen.v3</groupId>3    <artifactId>swagger-codegen-maven-plugin</artifactId>4    <version>3.0.71</version>5</dependency>
```

---

## Swagger Codegen Compatibility | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/compatibility/

**Contents:**
- Swagger Codegen Compatibility

The Swagger Codegen project has the following compatibilities with the OpenAPI Specification (formerly known as Swagger):

---

## Swagger Codegen Workflow Integration | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/workflow-integration

**Contents:**
- Swagger Codegen Workflow Integration
- Maven Integration
- Gradle Integration
- GitHub Integration

You can use the swagger-codegen-maven-plugin for integrating with your workflow, and generating any codegen target.

Gradle Swagger Generator Plugin is available for generating source code and API document.

To push the auto-generated SDK to GitHub, we provide git_push.sh to streamline the process. For example:

Create a new repository

**Examples:**

Example 1 (unknown):
```unknown
1 java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate \2 -i modules/swagger-codegen/src/test/resources/2_0/petstore.json -l perl \3 --git-user-id "swaggerapi" \4 --git-repo-id "petstore-perl" \5 --release-note "Github integration demo" \6 -o /var/tmp/perl/petstore
```

Example 2 (unknown):
```unknown
1cd /var/tmp/perl/petstore2/bin/sh ./git_push.sh
```

---

## Swagger Codegen Using Docker | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/docker/

**Contents:**
- Swagger Codegen Using Docker
- Development in docker
- Standalone generator Development in docker
- Run Docker in Vagrant
- Public Pre-built Docker images
  - Swagger Generator Docker Image
  - Swagger Codegen CLI Docker Image

You can use run-in-docker.sh to do all development. This script maps your local repository to /gen in the docker container. It also maps ~/.m2/repository to the appropriate container location.

To execute mvn package:

Build artifacts are now accessible in your working directory.

Once built, run-in-docker.sh will act as an executable for swagger-codegen-cli. To generate code, you’ll need to output to a directory under /gen (e.g. /gen/out). For example:

See standalone generator development

Prerequisite: install Vagrant and VirtualBox.

The Swagger Generator image can act as a self-hosted web application and API for generating code. This container can be incorporated into a CI pipeline, and requires at least two HTTP requests and some docker orchestration to access generated code.

Example usage (note this assumes jq is installed for command line processing of JSON):

In the example above, result.zip will contain the generated client.

The Swagger Codegen image acts as a standalone executable. It can be used as an alternative to installing via homebrew, or for developers who are unable to install Java or upgrade the installed version.

To generate code with this image, you’ll need to mount a local location as a volume.

(On Windows replace ${PWD} with %CD%)

The generated code will be located under ./out/go in the current directory.

**Examples:**

Example 1 (unknown):
```unknown
1git clone https://github.com/swagger-api/swagger-codegen2cd swagger-codegen3./run-in-docker.sh mvn package
```

Example 2 (sass):
```sass
1./run-in-docker.sh help # Executes 'help' command for swagger-codegen-cli2./run-in-docker.sh langs # Executes 'langs' command for swagger-codegen-cli3./run-in-docker.sh /gen/bin/go-petstore.sh  # Builds the Go client4./run-in-docker.sh generate -i modules/swagger-codegen/src/test/resources/2_0/petstore.yaml \5    -l go -o /gen/out/go-petstore -DpackageName=petstore # generates go client, outputs locally to ./out/go-petstore
```

Example 3 (unknown):
```unknown
1git clone http://github.com/swagger-api/swagger-codegen.git2cd swagger-codegen3vagrant up4vagrant ssh5cd /vagrant6./run-in-docker.sh mvn package
```

Example 4 (json):
```json
1# Start container and save the container id2CID=$(docker run -d swaggerapi/swagger-generator)3# allow for startup4sleep 55# Get the IP of the running container6GEN_IP=$(docker inspect --format '{{.NetworkSettings.IPAddress}}'  $CID)7# Execute an HTTP request and store the download link8RESULT=$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{9  "swaggerUrl": "https://petstore.swagger.io/v2/swagger.json"10}' 'http://localhost:8188/api/gen/clients/javascript' | jq '.link' | tr -d '"')11# Download the generated zip and redirect to a file12curl $RESULT > result.zip13# Shutdown the swagger generator image14docker stop $CID && docker rm $CID
```

---

## Swagger Codegen | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/about/

**Contents:**
- Swagger Codegen
- Versioning
- Supported Languages and Frameworks
- Compatibility
- Getting Started
- Generators
  - To generate a sample client library
  - Generating libraries from your server
  - Selective generation
  - Advanced Generator Customization

This is the Swagger Codegen project, which allows generation of API client libraries (SDK generation), server stubs and documentation automatically given an OpenAPI Description.

💚 If you would like to contribute, please refer to guidelines and a list of open tasks.💚

📔 For more information, please refer to the Wiki page and FAQ 📔

⚠️ If the OpenAPI Description or Swagger file is obtained from an untrusted source, please make sure you’ve reviewed the artefact before using Swagger Codegen to generate the API client, server stub or documentation as code injection may occur. ⚠️

⚠️ this document refers to version 3.X, check here for 2.X.

Both 2.X and 3.X version lines of Swagger Codegen are available and are independently maintained.

For full versioning info, please refer to the versioning documentation.

Here’s a summary of the supported languages/frameworks.

API clients: “csharp”, “csharp-dotnet2”, “dart”, “go”, “java”, “javascript”, “jaxrs-cxf-client”, “kotlin-client”, “php”, “python”, “r”, “ruby” “scala”, “swift3”, “swift4”, “swift5”, “typescript-angular”, “typescript-axios”, “typescript-fetch”

Server stubs: “aspnetcore”, “go-server”, “inflector”, “java-vertx”, “jaxrs-cxf”, “jaxrs-cxf-cdi”, “jaxrs-di”, “jaxrs-jersey”, “jaxrs-resteasy”, “jaxrs-resteasy-eap”, “jaxrs-spec”, “kotlin-server”, “micronaut”, “nodejs-server”, “python-flask”, “scala-akka-http-server”, “spring”

API documentation generators: “dynamic-html”, “html”, “html2”, “openapi”, “openapi-yaml”

To get a complete and/or realtime listing of supported languages/frameworks, you can directly query the online generator API or via a cURL command.

Check out the OpenAPI Specification for additional information about the OpenAPI project.

The OpenAPI Specification has undergone 3 revisions since initial creation in 2010. The current stable versions of Swagger Codegen project have the following compatibilities with the OpenAPI Specification:

💁 Here’s also an overview of what’s coming around the corner:

For detailed breakdown of all versions, please see the full compatibility listing.

To get up and running with Swagger Codegen, check out the following guides and instructions:

Once you’ve your environment setup, you’re ready to start generating clients and/or servers.

As a quick example, to generate a PHP client for Swagger Petstore, please run the following:

Note: if you’re on Windows, replace the last command with:

You can also download the JAR (latest release) directly from maven.org.

To get a list of general options available, please run:

To get a list of PHP specified options (which can be passed to the generator with a config file via the -c option), please run:

You can build a client against the swagger sample petstore API as follows:

On Windows, run .\bin\windows\java-petstore.bat instead.

This will run the generator with this command:

You can get the options with the generate --help command (below only shows partial results):

You can then compile and run the client, as well as unit tests against it:

Other languages have petstore samples, too:

It’s just as easy! Use the -i flag to point to either a server or file.

🔧 Swagger Codegen comes with a tonne of flexibility to support your code generation preferences. Checkout the generators documentation which takes you through some of the possibilities as well as showcasing how to generate from local files.

You may not want to generate all models in your project. Likewise you may want just one or two apis to be written, or even ignore certain file formats. If that’s the case check the selective generation instructions.

There are different aspects of customizing the code generator beyond just creating or modifying templates. Each language has a supporting configuration file to handle different type mappings, or bring your own models. For more information check out the advanced configuration docs.

You have options. The easiest is to use our online validator which not only will let you validate your OpenAPI file, but with the debug flag, you can see what’s wrong with your file. Check out Swagger Validator to validate a petstore example.

If you want to have validation directly on your own machine, then Spectral is an excellent option.

To do so, just use the -l dynamic-html flag when reading a spec file. This creates HTML documentation that is available as a single-page application with AJAX. To view the documentation:

Which launches a node.js server so the AJAX calls have a place to go.

It’s possible to leverage Swagger Codegen directly within your preferred CI/CD workflows to streamline your auto-generation requirements. Check out the workflows integration guide to see information on our Maven, Gradle, and GitHub integration options. 🚀

If you don’t want to run and host your own code generation instance, check our our online generators information.

Please refer to this page.

🚧 For swagger-codegen version 3 templates and classes for code generation are being migrated to swagger-codegen-generators repo. In order to know this migration process you can refer this page.

Please disclose any security-related issues or vulnerabilities by emailing security@swagger.io, instead of using the public issue tracker.

💚💚💚 We’d like to give a big shout out to all those who’ve contributed to Swagger Codegen, be that in raising issues, fixing bugs, authoring templates, or crafting useful content for others to benefit from. 💚💚💚

**Examples:**

Example 1 (unknown):
```unknown
1curl -X 'GET' \2  'https://generator3.swagger.io/api/client/V3' \3  -H 'accept: application/json'
```

Example 2 (unknown):
```unknown
1git clone https://github.com/swagger-api/swagger-codegen2cd swagger-codegen3git checkout 3.0.04mvn clean package5java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate \6   -i http://petstore.swagger.io/v2/swagger.json \7   -l php \8   -o /var/tmp/php_api_client
```

Example 3 (unknown):
```unknown
1java -jar modules\swagger-codegen-cli\target\swagger-codegen-cli.jar generate -i http://petstore.swagger.io/v2/swagger.json -l php -o c:\temp\php_api_client
```

Example 4 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate --help
```

---

## Swagger Codegen Generators Configuration | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/generators-configuration/

**Contents:**
- Swagger Codegen Generators Configuration
- Bringing your own models

There are different aspects of customizing the code generator beyond just creating or modifying templates. Each language has a supporting configuration file to handle different type mappings, etc:

Each of these files creates reasonable defaults so you can get running quickly. But if you want to configure package names, prefixes, model folders, etc. you can use a json config file to pass the values.

and config.json contains the following as an example:

Supported config options can be different per language. Running config-help -l {lang} will show available options. These options are applied via configuration file (e.g. config.json) or by passing them with java -jar swagger-codegen-cli.jar -D{optionName}={optionValue}.

If -D{optionName} does not work, please open a ticket and we’ll look into it.

Your config file for Java can look like

For all the unspecified options default values will be used.

Another way to override default options is to extend the config class for the specific language. To change, for example, the prefix for the Objective-C generated files, simply subclass the ObjcClientCodegen.java:

and specify the classname when running the generator:

Your subclass will now be loaded and overrides the PREFIX value in the superclass.

Sometimes you don’t want a model generated. In this case, you can simply specify an import mapping to tell the codegen what not to create. When doing this, every location that references a specific model will refer back to your classes. Note, this may not apply to all languages…

To specify an import mapping, use the --import-mappings argument and specify the model-to-import logic as such:

Or for multiple mappings:

**Examples:**

Example 1 (lua):
```lua
1$ ls -1 modules/swagger-codegen/src/main/java/io/swagger/codegen/languages/2AbstractJavaJAXRSServerCodegen.java3AbstractTypeScriptClientCodegen.java4... (results omitted)5TypeScriptAngularClientCodegen.java6TypeScriptNodeClientCodegen.java
```

Example 2 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate \2  -i https://petstore.swagger.io/v2/swagger.json \3  -l java \4  -o samples/client/petstore/java \5  -c path/to/config.json
```

Example 3 (json):
```json
1{2  "apiPackage" : "petstore"3}
```

Example 4 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar config-help -l java
```

---

## Swagger Codegen | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/about

**Contents:**
- Swagger Codegen
- Versioning
- Supported Languages and Frameworks
- Compatibility
- Getting Started
- Generators
  - To generate a sample client library
  - Generating libraries from your server
  - Selective generation
  - Advanced Generator Customization

This is the Swagger Codegen project, which allows generation of API client libraries (SDK generation), server stubs and documentation automatically given an OpenAPI Description.

💚 If you would like to contribute, please refer to guidelines and a list of open tasks.💚

📔 For more information, please refer to the Wiki page and FAQ 📔

⚠️ If the OpenAPI Description or Swagger file is obtained from an untrusted source, please make sure you’ve reviewed the artefact before using Swagger Codegen to generate the API client, server stub or documentation as code injection may occur. ⚠️

⚠️ this document refers to version 3.X, check here for 2.X.

Both 2.X and 3.X version lines of Swagger Codegen are available and are independently maintained.

For full versioning info, please refer to the versioning documentation.

Here’s a summary of the supported languages/frameworks.

API clients: “csharp”, “csharp-dotnet2”, “dart”, “go”, “java”, “javascript”, “jaxrs-cxf-client”, “kotlin-client”, “php”, “python”, “r”, “ruby” “scala”, “swift3”, “swift4”, “swift5”, “typescript-angular”, “typescript-axios”, “typescript-fetch”

Server stubs: “aspnetcore”, “go-server”, “inflector”, “java-vertx”, “jaxrs-cxf”, “jaxrs-cxf-cdi”, “jaxrs-di”, “jaxrs-jersey”, “jaxrs-resteasy”, “jaxrs-resteasy-eap”, “jaxrs-spec”, “kotlin-server”, “micronaut”, “nodejs-server”, “python-flask”, “scala-akka-http-server”, “spring”

API documentation generators: “dynamic-html”, “html”, “html2”, “openapi”, “openapi-yaml”

To get a complete and/or realtime listing of supported languages/frameworks, you can directly query the online generator API or via a cURL command.

Check out the OpenAPI Specification for additional information about the OpenAPI project.

The OpenAPI Specification has undergone 3 revisions since initial creation in 2010. The current stable versions of Swagger Codegen project have the following compatibilities with the OpenAPI Specification:

💁 Here’s also an overview of what’s coming around the corner:

For detailed breakdown of all versions, please see the full compatibility listing.

To get up and running with Swagger Codegen, check out the following guides and instructions:

Once you’ve your environment setup, you’re ready to start generating clients and/or servers.

As a quick example, to generate a PHP client for Swagger Petstore, please run the following:

Note: if you’re on Windows, replace the last command with:

You can also download the JAR (latest release) directly from maven.org.

To get a list of general options available, please run:

To get a list of PHP specified options (which can be passed to the generator with a config file via the -c option), please run:

You can build a client against the swagger sample petstore API as follows:

On Windows, run .\bin\windows\java-petstore.bat instead.

This will run the generator with this command:

You can get the options with the generate --help command (below only shows partial results):

You can then compile and run the client, as well as unit tests against it:

Other languages have petstore samples, too:

It’s just as easy! Use the -i flag to point to either a server or file.

🔧 Swagger Codegen comes with a tonne of flexibility to support your code generation preferences. Checkout the generators documentation which takes you through some of the possibilities as well as showcasing how to generate from local files.

You may not want to generate all models in your project. Likewise you may want just one or two apis to be written, or even ignore certain file formats. If that’s the case check the selective generation instructions.

There are different aspects of customizing the code generator beyond just creating or modifying templates. Each language has a supporting configuration file to handle different type mappings, or bring your own models. For more information check out the advanced configuration docs.

You have options. The easiest is to use our online validator which not only will let you validate your OpenAPI file, but with the debug flag, you can see what’s wrong with your file. Check out Swagger Validator to validate a petstore example.

If you want to have validation directly on your own machine, then Spectral is an excellent option.

To do so, just use the -l dynamic-html flag when reading a spec file. This creates HTML documentation that is available as a single-page application with AJAX. To view the documentation:

Which launches a node.js server so the AJAX calls have a place to go.

It’s possible to leverage Swagger Codegen directly within your preferred CI/CD workflows to streamline your auto-generation requirements. Check out the workflows integration guide to see information on our Maven, Gradle, and GitHub integration options. 🚀

If you don’t want to run and host your own code generation instance, check our our online generators information.

Please refer to this page.

🚧 For swagger-codegen version 3 templates and classes for code generation are being migrated to swagger-codegen-generators repo. In order to know this migration process you can refer this page.

Please disclose any security-related issues or vulnerabilities by emailing security@swagger.io, instead of using the public issue tracker.

💚💚💚 We’d like to give a big shout out to all those who’ve contributed to Swagger Codegen, be that in raising issues, fixing bugs, authoring templates, or crafting useful content for others to benefit from. 💚💚💚

**Examples:**

Example 1 (unknown):
```unknown
1curl -X 'GET' \2  'https://generator3.swagger.io/api/client/V3' \3  -H 'accept: application/json'
```

Example 2 (unknown):
```unknown
1git clone https://github.com/swagger-api/swagger-codegen2cd swagger-codegen3git checkout 3.0.04mvn clean package5java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate \6   -i http://petstore.swagger.io/v2/swagger.json \7   -l php \8   -o /var/tmp/php_api_client
```

Example 3 (unknown):
```unknown
1java -jar modules\swagger-codegen-cli\target\swagger-codegen-cli.jar generate -i http://petstore.swagger.io/v2/swagger.json -l php -o c:\temp\php_api_client
```

Example 4 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate --help
```

---

## SwaggerEditor | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-editor-next/

**Contents:**
- SwaggerEditor
- Anonymized analytics
- Getting started
  - Prerequisites
  - Installation
  - Usage
- Development
  - Prerequisites
  - Setting up
  - npm scripts

SwaggerEditor is using forked Create React App as it’s building infrastructure.

Swagger Editor uses Scarf to collect anonymized installation analytics. These analytics help support the maintainers of this library and ONLY run during installation. To opt out, you can set the scarfSettings.enabled field to false in your project’s package.json:

Alternatively, you can set the environment variable SCARF_ANALYTICS to false as part of the environment that installs your npm packages, e.g., SCARF_ANALYTICS=false npm install.

These prerequisites are required both for installing SwaggerEditor as a npm package and local development setup.

Assuming prerequisites are already installed, SwaggerEditor npm package is installable and works with Node.js >= 12.22.0. You can install SwaggerEditor via npm CLI by running the following command:

NOTE: when using bundler to build your project which is using swagger-editor@5 npm package, you might run into following Node.js error: Reached heap limit Allocation failed - JavaScript heap out of memory. It is caused by significant amount of code that needs to be bundled. This error can be resolved by extending the Node.js max heap limit: export NODE_OPTIONS="--max_old_space_size=4096".

Use the package in you application:

webpack.config.js (webpack@5)

Install dependencies needed for webpack@5 to properly build SwaggerEditor.

Alternative webpack.config.js (webpack@5)

We’ve already built Web Workers fragments for you, and they’re located inside our npm distribution package in dist/umd/ directory. In order to avoid complexity of building the Web Worker fragments you can use those fragments directly. This setup will work both for production and development (webpack-dev-server) and will significantly shorten your build process.

Install copy-webpack-plugin and other needed dependencies.

Assuming prerequisites are already installed, Node.js >=20.3.0 and npm >=9.6.7 are the minimum required versions that this repo runs on, but we recommend using the latest version of Node.js@20.

If you use nvm, running following command inside this repository will automatically pick the right Node.js version for you:

Run the following commands to set up the repository for local development:

Runs unit and integration tests

Runs E2E Cypress tests

Usage in development environment:

Usage in Continuous Integration (CI) environment:

This script will build all the SwaggerEditor build artifacts - app, esm and umd.

After building artifacts, every two new directories will be created: build/ and dist/.

Builds and serves standalone SwaggerEditor application and all it’s assets on http://localhost:3050/.

This bundle is suited for consumption by 3rd parties, which want to use SwaggerEditor as a library in their own applications and have their own build process.

SwaggerEditor UMD bundle exports SwaggerEditor symbol on global object. It’s bundled with React defined as external. This allows consumer to use his own version of React + ReactDOM and mount SwaggerEditor lazily.

SwaggerEditor is released as swagger-editor@5 npm package on npmjs.com. Package can also be produced manually by running following commands (assuming you’re already followed setting up steps):

SwaggerEditor maps its build artifacts in package.json file in following way:

To learn more about these fields please refer to webpack mainFields documentation or to Node.js Modules: Packages documentation.

[!IMPORTANT] By older versions we specifically refer to React >=17 <18.

By default swagger-editor@5 npm package comes with latest version of React@18. It’s possible to use swagger-editor@5 npm package with older version of React.

Let’s say my application integrates with swagger-editor@5 npm package and uses React@17.0.2.

In order to inform swagger-editor@5 npm package that I require it to use my React version, I need to use npm overrides.

[!NOTE] The React and ReactDOM override are defined as a reference to the dependency. Since react-redux@9 only supports React >= 18, we need to use react-redux@8.

In order to inform swagger-editor@5 npm package that I require it to use my specific React version, I need to use yarn resolutions.

[!NOTE] The React and ReactDOM resolution cannot be defined as a reference to the dependency. Unfortunately yarn does not support aliasing like $react or $react-dom as npm does. You’ll need to specify the exact versions.

It is possible to use an environment variable to specify a local JSON/YAML file or a remote URL for SwaggerEditor to load on startup. These environment variables will get baked in during build time into build artifacts.

Environment variables currently available:

Sample environment variable values can be found in .env file. For more information about using environment variables, please refer to adding Custom Environment Variables section of Create React App documentation.

SwaggerEditor comes with number of preview plugins that are responsible for rendering the definition that’s being created in the editor. These plugins include:

With a bit of adapting, we can use these plugins with SwaggerUI to provide ability to render AsyncAPI or API Design Systems definitions with SwaggerUI.

The key here is SwaggerUIAdapter plugin which adapts SwaggerEditor plugins to use directly with SwaggerUI.

SwaggerUI standalone mode is supported as well. With standalone mode you’ll get a TopBar with an input where URL of the definition can be provided and this definition is subsequently loaded by the SwaggerUI.

It’s possible to utilize preview plugins in a build-free way via unpkg.com to create a standalone multi-spec supporting version of SwaggerUI.

SwaggerEditor is just a number of SwaggerUI plugins used with swagger-ui-react. Customized SwaggerEditor can be created by composing individual plugins with either swagger-ui and swagger-ui-react.

List of available plugins:

Individual plugins can be imported in the following way:

Along with plugins, presets are available as well. Preset is a collection of plugins that are design to work together to provide a compound feature.

List of available presets:

Individual presets can be imported in the following way:

NOTE: Please refer to the Plug points documentation of SwaggerUI to understand how presets are passed to SwaggerUI.

SwaggerEditor is available as a pre-built docker image hosted on docker.swagger.io.

Now open your browser at http://localhost:8080/.

Now open your browser at http://localhost:8080/.

No custom environment variables are currently supported by SwaggerEditor.

SwaggerEditor is licensed under Apache 2.0 license. SwaggerEditor comes with an explicit NOTICE file containing additional legal notifications and information.

This project uses REUSE specification that defines a standardized method for declaring copyright and licensing for software projects.

Software Bill Of materials is available in this repository dependency graph. Click on Export SBOM button to download the SBOM in SPDX format.

**Examples:**

Example 1 (lua):
```lua
1{2  // ...3  "scarfSettings": {4    "enabled": false5  }6  // ...7}
```

Example 2 (elixir):
```elixir
1 $ npm install swagger-editor@alpha
```

Example 3 (jsx):
```jsx
1import React from 'react';2import ReactDOM from 'react-dom';3import SwaggerEditor from 'swagger-editor';4import 'swagger-editor/swagger-editor.css';5
6const url = "https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml";7
8const MyApp = () => (9  <div>10    <h1>SwaggerEditor Integration</h1>11    <SwaggerEditor url={url} />12  </div>13);14
15self.MonacoEnvironment = {16  /**17   * We're building into the dist/ folder. When application starts on18   * URL=https://example.com then SwaggerEditor will look for19   * `apidom.worker.js` on https://example.com/dist/apidom.worker.js and20   * `editor.worker` on https://example.com/dist/editor.worker.js.21   */22  baseUrl: `${document.baseURI || location.href}dist/`,23}24
25ReactDOM.render(<MyApp />, document.getElementById('swagger-editor'));
```

Example 4 (unknown):
```unknown
1 $ npm i stream-browserify --save-dev2 $ npm i https-browserify --save-dev3 $ npm i stream-http --save-dev4 $ npm i util --save-dev
```

---

## OAuth 2.0 configuration | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-ui/usage/oauth2/

**Contents:**
- OAuth 2.0 configuration

You can configure OAuth 2.0 authorization by calling the initOAuth method.

**Examples:**

Example 1 (lua):
```lua
1const ui = SwaggerUI({...})2
3// Method can be called in any place after calling constructor SwaggerUIBundle4ui.initOAuth({5    clientId: "your-client-id",6    clientSecret: "your-client-secret-if-required",7    realm: "your-realms",8    appName: "your-app-name",9    scopeSeparator: " ",10    scopes: "openid profile",11    additionalQueryStringParams: {test: "hello"},12    useBasicAuthenticationWithAccessCodeGrant: true,13    usePkceWithAuthorizationCodeGrant: true14  })
```

---

## Swagger Codegen Using Docker | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/docker

**Contents:**
- Swagger Codegen Using Docker
- Development in docker
- Standalone generator Development in docker
- Run Docker in Vagrant
- Public Pre-built Docker images
  - Swagger Generator Docker Image
  - Swagger Codegen CLI Docker Image

You can use run-in-docker.sh to do all development. This script maps your local repository to /gen in the docker container. It also maps ~/.m2/repository to the appropriate container location.

To execute mvn package:

Build artifacts are now accessible in your working directory.

Once built, run-in-docker.sh will act as an executable for swagger-codegen-cli. To generate code, you’ll need to output to a directory under /gen (e.g. /gen/out). For example:

See standalone generator development

Prerequisite: install Vagrant and VirtualBox.

The Swagger Generator image can act as a self-hosted web application and API for generating code. This container can be incorporated into a CI pipeline, and requires at least two HTTP requests and some docker orchestration to access generated code.

Example usage (note this assumes jq is installed for command line processing of JSON):

In the example above, result.zip will contain the generated client.

The Swagger Codegen image acts as a standalone executable. It can be used as an alternative to installing via homebrew, or for developers who are unable to install Java or upgrade the installed version.

To generate code with this image, you’ll need to mount a local location as a volume.

(On Windows replace ${PWD} with %CD%)

The generated code will be located under ./out/go in the current directory.

**Examples:**

Example 1 (unknown):
```unknown
1git clone https://github.com/swagger-api/swagger-codegen2cd swagger-codegen3./run-in-docker.sh mvn package
```

Example 2 (sass):
```sass
1./run-in-docker.sh help # Executes 'help' command for swagger-codegen-cli2./run-in-docker.sh langs # Executes 'langs' command for swagger-codegen-cli3./run-in-docker.sh /gen/bin/go-petstore.sh  # Builds the Go client4./run-in-docker.sh generate -i modules/swagger-codegen/src/test/resources/2_0/petstore.yaml \5    -l go -o /gen/out/go-petstore -DpackageName=petstore # generates go client, outputs locally to ./out/go-petstore
```

Example 3 (unknown):
```unknown
1git clone http://github.com/swagger-api/swagger-codegen.git2cd swagger-codegen3vagrant up4vagrant ssh5cd /vagrant6./run-in-docker.sh mvn package
```

Example 4 (json):
```json
1# Start container and save the container id2CID=$(docker run -d swaggerapi/swagger-generator)3# allow for startup4sleep 55# Get the IP of the running container6GEN_IP=$(docker inspect --format '{{.NetworkSettings.IPAddress}}'  $CID)7# Execute an HTTP request and store the download link8RESULT=$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{9  "swaggerUrl": "https://petstore.swagger.io/v2/swagger.json"10}' 'http://localhost:8188/api/gen/clients/javascript' | jq '.link' | tr -d '"')11# Download the generated zip and redirect to a file12curl $RESULT > result.zip13# Shutdown the swagger generator image14docker stop $CID && docker rm $CID
```

---

## Swagger Codegen Building | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/building

**Contents:**
- Swagger Codegen Building
- Homebrew
- To build a server stub
- To build the codegen library

After cloning the project, you can build it from source with this command:

If you don’t have maven installed, you may directly use the included maven wrapper, and build with the command:

To install, run brew install swagger-codegen

Here is an example usage:

Please refer to https://github.com/swagger-api/swagger-codegen/wiki/Server-stub-generator-HOWTO for more information.

This will create the Swagger Codegen library from source.

Note! The templates are included in the library generated. If you want to modify the templates, you’ll need to either repackage the library OR specify a path to your scripts.

**Examples:**

Example 1 (unknown):
```unknown
1mvn clean package
```

Example 2 (unknown):
```unknown
1./mvnw clean package
```

Example 3 (unknown):
```unknown
1swagger-codegen generate -i https://petstore.swagger.io/v2/swagger.json -l ruby -o /tmp/test/
```

Example 4 (unknown):
```unknown
1mvn package
```

---

## Swagger Codegen Compatibility | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/compatibility

**Contents:**
- Swagger Codegen Compatibility

The Swagger Codegen project has the following compatibilities with the OpenAPI Specification (formerly known as Swagger):

2.4.47-SNAPSHOT (current master, upcoming minor release) SNAPSHOT| TBD | 1.0, 1.1, 1.2, 2.0 | Minor release 2.4.46 (current stable) | 2025-06-30 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.46 2.4.45 | 2025-06-08 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.45 2.4.44 | 2024-12-18 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.44 2.4.43 | 2024-08-09 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.43 2.4.42 | 2024-07-29 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.42 2.4.41 | 2024-04-22 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.41 2.4.39 | 2024-01-02 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.39 2.4.38 | 2023-12-29 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.38 2.4.37 | 2023-11-21 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.37 2.4.36 | 2023-10-26 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.36 2.4.35 | 2023-10-26 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.35 2.4.34 | 2023-10-19 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.34 2.4.33 | 2023-10-02 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.33 2.4.32 | 2023-05-17 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.32 2.4.31 | 2023-04-02 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.31 2.4.30 | 2023-02-16 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.30 2.4.29 | 2022-11-10 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.29 2.4.28 | 2022-08-15 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.28 2.4.27 | 2022-04-12 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.27 2.4.26 | 2022-02-07 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.26 2.4.25 | 2021-12-28 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.25 2.4.24 | 2021-11-18 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.24 2.4.23 | 2021-10-08 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.23 2.4.22 | 2021-09-30 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.22 2.4.21 | 2021-06-28 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.21 2.4.20 | 2021-05-28 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.20 2.4.19 | 2021-03-04 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.19 2.4.18 | 2020-12-29 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.18 2.4.17 | 2020-11-02 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.17 2.4.16 | 2020-10-05 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.16 2.4.15 | 2020-07-28 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.15 2.4.14 | 2020-05-18 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.14 2.4.13 | 2020-04-02 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.13 2.4.12 | 2020-01-15 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.12 2.4.11 | 2020-01-03 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.11 2.4.10 | 2019-11-16 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.10 2.4.9 | 2019-10-14 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.9 2.4.8 | 2019-08-24 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.8 2.4.7 | 2019-07-11 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.7 2.4.6 | 2019-06-28 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.6 2.4.5 | 2019-04-25 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.5 2.4.4 | 2019-03-26 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.4 2.4.2 | 2019-02-18 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.2 2.4.1 | 2019-01-16 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.1 2.4.0 | 2018-11-30 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.0 2.3.1 | 2018-01-17 | 1.0, 1.1, 1.2, 2.0 | tag v2.3.1 2.3.0 | 2017-12-21 | 1.0, 1.1, 1.2, 2.0 | tag v2.3.0 2.2.3 | 2017-07-15 | 1.0, 1.1, 1.2, 2.0 | tag v2.2.3 2.2.2 | 2017-03-01 | 1.0, 1.1, 1.2, 2.0 | tag v2.2.2 2.2.1 | 2016-08-07 | 1.0, 1.1, 1.2, 2.0 | tag v2.2.1 2.1.6 | 2016-04-06 | 1.0, 1.1, 1.2, 2.0 | tag v2.1.6 2.0.17 | 2014-08-22 | 1.1, 1.2 | tag v2.0.17 1.0.4 | 2012-04-12 | 1.0, 1.1 | tag v1.0.4

---

## Swagger Codegen Building | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/building

**Contents:**
- Swagger Codegen Building
- Homebrew
- To build a server stub
- To build the codegen library

After cloning the project, you can build it from source with this command:

To install, run brew install swagger-codegen

Here is an example usage:

Please refer to wiki for more information.

This will create the Swagger Codegen library from source.

The templates are included in the library generated. If you want to modify the templates, you’ll need to either repackage the library OR specify a path to your scripts.

**Examples:**

Example 1 (unknown):
```unknown
1mvn clean package
```

Example 2 (unknown):
```unknown
1swagger-codegen generate -i http://petstore.swagger.io/v2/swagger.json -l ruby -o /tmp/test/
```

Example 3 (unknown):
```unknown
1mvn package
```

---

## Swagger Codegen Workflow Integration | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/workflow-integration

**Contents:**
- Swagger Codegen Workflow Integration
- Maven Integration
- Gradle Integration
- GitHub Integration

You can use the swagger-codegen-maven-plugin for integrating with your workflow, and generating any codegen target.

Gradle Swagger Generator Plugin is available for generating source code and API document.

To push the auto-generated SDK to GitHub, we provide git_push.sh to streamline the process. For example:

Create a new repository in GitHub (Ref: https://help.github.com/articles/creating-a-new-repository/)

**Examples:**

Example 1 (unknown):
```unknown
1 java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate \2 -i modules/swagger-codegen/src/test/resources/2_0/petstore.json -l perl \3 --git-user-id "swaggerapi" \4 --git-repo-id "petstore-perl" \5 --release-note "Github integration demo" \6 -o /var/tmp/perl/petstore
```

Example 2 (unknown):
```unknown
1cd /var/tmp/perl/petstore2/bin/sh ./git_push.sh
```

---

## Swagger Codegen Compatibility | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/compatibility/

**Contents:**
- Swagger Codegen Compatibility

The Swagger Codegen project has the following compatibilities with the OpenAPI Specification (formerly known as Swagger):

2.4.47-SNAPSHOT (current master, upcoming minor release) SNAPSHOT| TBD | 1.0, 1.1, 1.2, 2.0 | Minor release 2.4.46 (current stable) | 2025-06-30 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.46 2.4.45 | 2025-06-08 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.45 2.4.44 | 2024-12-18 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.44 2.4.43 | 2024-08-09 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.43 2.4.42 | 2024-07-29 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.42 2.4.41 | 2024-04-22 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.41 2.4.39 | 2024-01-02 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.39 2.4.38 | 2023-12-29 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.38 2.4.37 | 2023-11-21 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.37 2.4.36 | 2023-10-26 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.36 2.4.35 | 2023-10-26 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.35 2.4.34 | 2023-10-19 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.34 2.4.33 | 2023-10-02 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.33 2.4.32 | 2023-05-17 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.32 2.4.31 | 2023-04-02 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.31 2.4.30 | 2023-02-16 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.30 2.4.29 | 2022-11-10 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.29 2.4.28 | 2022-08-15 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.28 2.4.27 | 2022-04-12 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.27 2.4.26 | 2022-02-07 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.26 2.4.25 | 2021-12-28 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.25 2.4.24 | 2021-11-18 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.24 2.4.23 | 2021-10-08 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.23 2.4.22 | 2021-09-30 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.22 2.4.21 | 2021-06-28 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.21 2.4.20 | 2021-05-28 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.20 2.4.19 | 2021-03-04 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.19 2.4.18 | 2020-12-29 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.18 2.4.17 | 2020-11-02 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.17 2.4.16 | 2020-10-05 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.16 2.4.15 | 2020-07-28 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.15 2.4.14 | 2020-05-18 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.14 2.4.13 | 2020-04-02 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.13 2.4.12 | 2020-01-15 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.12 2.4.11 | 2020-01-03 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.11 2.4.10 | 2019-11-16 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.10 2.4.9 | 2019-10-14 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.9 2.4.8 | 2019-08-24 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.8 2.4.7 | 2019-07-11 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.7 2.4.6 | 2019-06-28 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.6 2.4.5 | 2019-04-25 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.5 2.4.4 | 2019-03-26 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.4 2.4.2 | 2019-02-18 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.2 2.4.1 | 2019-01-16 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.1 2.4.0 | 2018-11-30 | 1.0, 1.1, 1.2, 2.0 | tag v2.4.0 2.3.1 | 2018-01-17 | 1.0, 1.1, 1.2, 2.0 | tag v2.3.1 2.3.0 | 2017-12-21 | 1.0, 1.1, 1.2, 2.0 | tag v2.3.0 2.2.3 | 2017-07-15 | 1.0, 1.1, 1.2, 2.0 | tag v2.2.3 2.2.2 | 2017-03-01 | 1.0, 1.1, 1.2, 2.0 | tag v2.2.2 2.2.1 | 2016-08-07 | 1.0, 1.1, 1.2, 2.0 | tag v2.2.1 2.1.6 | 2016-04-06 | 1.0, 1.1, 1.2, 2.0 | tag v2.1.6 2.0.17 | 2014-08-22 | 1.1, 1.2 | tag v2.0.17 1.0.4 | 2012-04-12 | 1.0, 1.1 | tag v1.0.4

---

## Swagger Codegen Generators Configuration | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/generators-configuration/

**Contents:**
- Swagger Codegen Generators Configuration
- Bringing your own models

There are different aspects of customizing the code generator (located in this version at swagger codegen generator repo) beyond just creating or modifying templates. Each language has a supporting configuration file to handle different type mappings, etc:

Each of these files creates reasonable defaults so you can get running quickly. If you want to configure package names, prefixes, model folders, etc. you can use a JSON config file to pass the values.

and config.json contains the following as an example:

Supported config options can be different per language. Running config-help -l {lang} will show available options. These options are applied via configuration file (e.g. config.json) or by passing them with -D{optionName}={optionValue}.

If -D{optionName} does not work, please open a ticket and we’ll look into it.

Your config file for Java can look like

For all the unspecified options default values will be used.

Another way to override default options is to extend the config class for the specific language. To change, for example, the prefix for the Objective-C generated files, simply subclass the ObjcClientCodegen.java:

and specify the classname when running the generator:

Your subclass will now be loaded and overrides the PREFIX value in the superclass.

Sometimes you don’t want a model generated. In this case, you can simply specify an import mapping to tell the codegen what not to create. When doing this, every location that references a specific model will refer back to your classes.

Note, this may not apply to all languages!

To specify an import mapping, use the --import-mappings argument and specify the model-to-import logic as such:

Or for multiple mappings:

**Examples:**

Example 1 (lua):
```lua
1s -1 modules/swagger-codegen/src/main/java/io/swagger/codegen/languages/2
3AbstractJavaCodegen.java4AbstractJavaJAXRSServerCodegen.java5... (results omitted)6JavaClientCodegen.java7JavaJAXRSSpecServerCodegen.java
```

Example 2 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate \2  -i http://petstore.swagger.io/v2/swagger.json \3  -l java \4  -o samples/client/petstore/java \5  -c path/to/config.json
```

Example 3 (json):
```json
1{2  "apiPackage" : "petstore"3}
```

Example 4 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar config-help -l java
```

---

## Deep Linking | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-ui/usage/deep-linking/

**Contents:**
- Deep Linking
- Usage
    - Fragment format
- FAQ

Swagger UI allows you to deeply link into tags and operations within a spec. When Swagger UI is provided a URL fragment at runtime, it will automatically expand and scroll to a specified tag or operation.

👉🏼 Add deepLinking: true to your Swagger UI configuration to enable this functionality. This is demonstrated in dist/index.html.

When you expand a tag or operation, Swagger UI will automatically update its URL fragment with a deep link to the item. Conversely, when you collapse a tag or operation, Swagger UI will clear the URL fragment.

You can also right-click a tag name or operation path to copy a link to that tag or operation.

The fragment is formatted in one of two ways:

operationId is the explicit operationId provided in the spec, if one exists. Otherwise, Swagger UI generates an implicit operationId by combining the operation’s path and method, while escaping non-alphanumeric characters.

I’m using Swagger UI in an application that needs control of the URL fragment. How do I disable deep-linking?

This functionality is disabled by default, but you can pass deepLinking: false into Swagger UI as a configuration item to be sure.

Can I link to multiple tags or operations?

No, this is not supported.

Can I collapse everything except the operation or tag I’m linking to?

Sure - use docExpansion: none to collapse all tags and operations. Your deep link will take precedence over the setting, so only the tag or operation you’ve specified will be expanded.

---

## Detecting your Swagger UI version | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-ui/usage/version-detection/

**Contents:**
- Detecting your Swagger UI version
- Swagger UI 3.x
- Swagger UI 2.x and under

At times, you’re going to need to know which version of Swagger UI you use.

The first step would be to detect which major version you currently use, as the method of detecting the version has changed. If your Swagger UI has been heavily modified and you cannot detect from the look and feel which major version you use, you’d have to try both methods to get the exact version.

To help you visually detect which version you’re using, we’ve included supporting images.

Some distinct identifiers to Swagger UI 3.x:

If you’ve determined this is the version you have, to find the exact version:

Note: This functionality was added in 3.0.8. If you’re unable to execute it, you’re likely to use an older version, and in that case the first step would be to upgrade.

Some distinct identifiers to Swagger UI 2.x:

If you’ve determined this is the version you have, to find the exact version:

**Examples:**

Example 1 (sql):
```sql
1/**2 * swagger-ui - Swagger UI is a dependency-free collection of HTML, JavaScript, and CSS assets that dynamically generate beautiful documentation from a Swagger-compliant API3 * @version v2.2.94 * @link https://swagger.io5 * @license Apache-2.06 */
```

---

## Swagger Codegen Prerequisites | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/prerequisites/

**Contents:**
- Swagger Codegen Prerequisites
- OS X Users

If you’re looking for the latest stable version, you can grab it directly from Maven.org (Java 8 runtime at a minimum):

For Windows users, you will need to install wget or you can use Invoke-WebRequest in PowerShell (3.0+).

On a mac, it’s even easier with brew:

To build from source, you need the following installed and available in your $PATH:

Apache maven 3.6.2 or greater

Don’t forget to install Java 11+.

Export JAVA_HOME in order to use the supported Java version:

**Examples:**

Example 1 (unknown):
```unknown
1# Download current stable 2.x.x branch (Swagger and OpenAPI version 2)2wget https://repo1.maven.org/maven2/io/swagger/swagger-codegen-cli/2.4.46/swagger-codegen-cli-2.4.46.jar -O swagger-codegen-cli.jar3
4java -jar swagger-codegen-cli.jar help5
6# Download current stable 3.x.x branch (OpenAPI version 3)7wget https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.71/swagger-codegen-cli-3.0.71.jar -O swagger-codegen-cli.jar8
9java -jar swagger-codegen-cli.jar --help
```

Example 2 (unknown):
```unknown
1Invoke-WebRequest -OutFile swagger-codegen-cli.jar https://repo1.maven.org/maven2/io/swagger/swagger-codegen-cli/2.4.45/swagger-codegen-cli-2.4.45.jar
```

Example 3 (unknown):
```unknown
1brew install swagger-codegen
```

Example 4 (bash):
```bash
1export JAVA_HOME=`/usr/libexec/java_home -v 11`2export PATH=${JAVA_HOME}/bin:$PATH
```

---

## Swagger Codegen Generators | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v3/generators/

**Contents:**
- Swagger Codegen Generators
- Modifying the client library format
- Making your own codegen modules
- Generating a client from local files

If the default generator configuration does not meet your needs, you have various options to modify or create new modules or templates.

Don’t like the default swagger client syntax? Want a different language supported? No problem!

Swagger Codegen processes handlebar templates with the Handlebars.java engine. You can modify our templates or make your own.

Take a look at swagger-codegen-generators for examples. To make your own templates, create your own files and use the -t flag to specify your template folder. It actually is that easy!

If you’re starting a project with a new language and don’t see what you need, Swagger Codegen can help you create a project to generate your own libraries:

This will write, in the folder output/myLibrary, all the files you need to get started, including a README.md. Once modified and compiled, you can load your library with the codegen and generate clients with your own, custom-rolled logic.

You would then compile your library in the output/myLibrary folder with mvn package and execute the codegen like such:

For Windows users, you will need to use ; instead of : in the classpath, e.g.:

Note the myClientCodegen is an option now, and you can use the usual arguments for generating your library:

See also standalone generator development.

If you don’t want to call your server, you can save the OpenAPI Description files into a directory and pass an argument to the code generator like this:

Great for creating libraries on your CI server, from the Swagger Editor … or while coding on an airplane ✈️.

**Examples:**

Example 1 (unknown):
```unknown
1java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar meta \2  -o output/myLibrary -n myClientCodegen -p com.my.company.codegen
```

Example 2 (unknown):
```unknown
1java -cp output/myLibrary/target/myClientCodegen-swagger-codegen-1.0.0.jar:modules/swagger-codegen-cli/target/swagger-codegen-cli.jar io.swagger.codegen.v3.cli.SwaggerCodegen
```

Example 3 (unknown):
```unknown
1java -cp output/myLibrary/target/myClientCodegen-swagger-codegen-1.0.0.jar;modules/swagger-codegen-cli/target/swagger-codegen-cli.jar io.swagger.codegen.v3.cli.SwaggerCodegen
```

Example 4 (unknown):
```unknown
1java -cp output/myLibrary/target/myClientCodegen-swagger-codegen-1.0.0.jar:modules/swagger-codegen-cli/target/swagger-codegen-cli.jar \2  io.swagger.codegen.v3.cli.SwaggerCodegen generate -l myClientCodegen\3  -i http://petstore.swagger.io/v2/swagger.json \4  -o myClient
```

---

## Swagger Codegen Compatibility | Swagger Docs

**URL:** https://swagger.io/docs/open-source-tools/swagger-codegen/codegen-v2/compatibility

**Contents:**
- Swagger Codegen Compatibility

The Swagger Codegen project has the following compatibilities with the OpenAPI Specification (formerly known as Swagger):

---
