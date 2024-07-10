# Infra State Matcher
Support Terraform State for Matching config between resources e.g. compare config between Active Site & DR Site

## Getting Started

### Installation

```
npm install @thaitype/infra-state-matcher
```

### Usage

1. Export Terraform State into serialized JSON format on your terraform root module directory
    ```bash
    terraform show -json > prod.state.json
    ```
2. Copy the JSON file to the directory where you want to run the matcher
    ```bash
    cp prod.state.json .state/prod.state.json
    ```
3. Run build command to generate the matcher type helper, `ism build`
4. Write a configuration file for matching resources between two Terraform states, see example in `examples/simple.match.ts`
    1. Import Type Helper from the generated file
      ```ts
      import type { State } from '../.gen/SimpleStateMatcher/types.js';
      ```
    2. Write your own class and inherit `ResourceAnnotation` class for declaring resources metadata for matching in test cases
      ```ts
      class SimpleResourceAnnotation extends ResourceAnnotation {
        public label(resources: GenericResourceAnnotation[]): GenericResourceAnnotation[] {
          // Write your logic here
          return resources;
        }
      }
      ```
    3. Write your own class and inherit `StateMatcher` class for matching resources between two Terraform states
      ```ts
      class SimpleStateMatcher extends StateMatcher {
        public match(): void {
          const matcher = new ConfigMatcher({
            defaultPair: {
              actual: { site: 'dr' },
              expected: { site: 'active' },
            },
          });

          // Starting matching the resource `azurerm_app_service` with the service `web` and scope `contractor`
          const contractorWeb = matcher.createResourceMatcher<State['azurerm_app_service.common_auth_gateway']>({
            resource_type: 'azurerm_app_service',
            service: 'web',
            scope: 'contractor',
          });

          contractorWeb.expectKey('values.app_settings.APPLICATIONINSIGHTS_CONNECTION_STRING').matchConstant('value');
        }
      }
      ```
    4. Config how the matcher should run in the main function
      ```ts
      export default new MatchRunner({
        annotation: SimpleResourceAnnotation,
        stateMather: SimpleStateMatcher,
        options: {
          stateFile: ".state/prod.state.json",
        },
      });
      ```
5. Run start command to start the matching process, `ism`

## Local Development

### Development
```
bun install
bun run build
```

### Type Checking
```
bun run check
```

### Type Checking with Watch
```
bun run check:watch
```

### Publish

Using `release-it` to publish the package, using npm commandline with OTP (One Time Password) for 2FA (Two Factor Authentication)

```
bun run release
``` 