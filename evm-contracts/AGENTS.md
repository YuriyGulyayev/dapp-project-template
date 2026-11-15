# Hardhat 3 + Ethers.js 6 + Mocha Project

## Project Layout

- `hardhat.config.ts` -- Hardhat configuration.
- `contracts/` -- Contract sources (`*.sol`) and unit tests (`*.t.sol`).
- `test/src/tests/` -- Contract integration tests (`*.ts`).
- `ignition/` -- Hardhat Ignition deployment modules.
- `scripts/` -- Standalone scripts run with `hardhat run`.
- Folders such as `cache/`, `artifacts/`, `types/`, `coverage/` contain generated outputs.

## Solidity

- Before proposing improvements to existing Solidity code, review `docs/contract-improvement-ideas-not-to-propose-in-existing-code.md`. Do not propose the listed improvement ideas for existing code unless explicitly requested. You may propose them for new code, but do not implement them without approval in the prompt or an approved plan. This restriction does not prohibit reporting concrete defects or risks discovered during a requested code review.

## Skills

- When writing or modifying tests, configuring `hardhat.config.ts`, or interacting with the blockchain from TypeScript, invoke the `hardhat` skill. It covers Solidity and TypeScript testing, how to choose between them, `forge-std` cheatcodes, the `network.create` API, `networkHelpers`, and the compile-then-typecheck workflow. The skill itself points to the matching `hardhat-toolbox-*` skill for toolbox-specific guidance (signers, contract interaction, assertions).
- Note that the aforementioned skills come from Hardhat developers. I have not edited them. They are not necessarily aware of any customizations configured in `hardhat.config.ts`, such as `paths`, or my Node.js version. Therefore treat the skills as general guidance, respect project-specific configuration and instructions.

## Docs

- Hardhat 3 -- https://hardhat.org/llms.txt
- Ethers.js 6 -- https://docs.ethers.org/v6/
