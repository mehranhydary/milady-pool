# Milady Pool

Milady Pool is a dark pool, a private platform where users trade crypto without disclosing intentions to a wider market.

## Archtecture

This app has 4 parts.

1. UI
2. AVS
3. Contracts
4. ZKP

### User Interface

The user interface is stored in the `/ui` folder. It is a Next JS app. Milady Pool uses a single page app for users to create and view orders. As a user, you can connect your wallet and create private orders using the user interface.

### Actively Validated Service

The actively validated service (AVS) is responsible for storing, processing, and submitting private orders. It is a Node JS app with a GraphQL API. When orders are created, they are stored in a Postgresql database. The Node JS app also has contract listeners. As events are emitted from the chain the Milady Pool contracts are deployed to, the Node JS app is responsible for processing and submitting relevant orders based on the event.

### Contracts

A contract called `MiladyPoolTaskManager` was designed as a Uniswap V4 hook that can process limit orders from the Milady Pool AVS.

### ZKP

TBD

## Getting started

Instructions to manually run Milady Pool are listed below. Please note that this code should only be used for testing and should not be used in production.

1. To get started, we will prepare the contracts
2. Run `cd contracts && cp .env.example .env`
3. Run `forge build`
4. Start anvil by opening another terminal and running `anvil`
5. In another terminal, deploy Eigenlayer contracts

Change into `contracts/lib/eigenlayer-middleware/lib/eigenlayer-contracts` and run the following commands

```sh
forge script script/deploy/M2_Deploy_From_Scratch.s.sol --rpc-url http://localhost:8545 \
--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast \
--sig "run(string memory configFile)" -- M2_deploy_from_scratch.anvil.config.json
```

6. In another terminal deploy Milady Pool contracts

```sh
cd contracts

forge script script/MiladyPoolDeployer.s.sol --rpc-url http://localhost:8545 --private-key \
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast -v
```

7. Next, start the operator. Run `cd operator` to change into the AVS server folder
8. Run `yarn` to install all dependencies
9. Run `cp .env.example .env` and update your `.env` accordingly
10. ...

```

```
