# Hardhat 3 + Ethers.js 6 + Mocha Project

## Project Layout

- `hardhat.config.ts` -- Hardhat configuration.
- `contracts/` -- Solidity source files (`*.sol`) and unit tests (`*.t.sol`).
- `test/src/tests/` -- TypeScript integration tests.
- `ignition/` -- Hardhat Ignition deployment modules.
- `scripts/` -- Standalone scripts run with `hardhat run`.

## Skills

- When writing or modifying tests, configuring `hardhat.config.ts`, or interacting with the blockchain from TypeScript, invoke the `hardhat` skill. It covers Solidity and TypeScript testing, how to choose between them, `forge-std` cheatcodes, the `network.create` API, `networkHelpers`, and the compile-then-typecheck workflow. The skill itself points to the matching `hardhat-toolbox-*` skill for toolbox-specific guidance (signers, contract interaction, assertions).
- Note that the aforementioned skills come from Hardhat developers. I have not edited them. They are not necessarily aware of any customizations configured in `hardhat.config.ts`, such as `paths`, or my Node.js version. Therefore treat the skills as general guidance, respect project-specific configuration and instructions.

## Docs

- Hardhat 3 -- https://hardhat.org/llms.txt
- Ethers.js 6 -- https://docs.ethers.org/v6/
