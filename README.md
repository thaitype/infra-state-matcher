# Infra State Matcher
Support Terraform State for Matching config between resources e.g. compare config between Active Site & DR Site

## Getting Started

### Installation

```
npm install @thaitype/infra-state-matcher
```

### Usage

1. Write a configuration file for matching resources between two Terraform states, see example in `examples/simple.match.ts`
2. Run build command to generate the matcher type helper, `ism build`
3. Run start command to start the matching process, `ism`

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