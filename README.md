# Milady Pool

Users of a dark pool cannot see open orders of others. It is a private platform where users can buy or sell significant amounts of assets without disclosing their intentions to a wider market. Dark pools provide a discreet system to institutional players so that their strategies or trades are kept secret.

# Users:

This protocol is for institutions looking to facilitate large trades through a private protocol.

# Pros:

1. Improved liquidity for large orders
2. Access to diverse participants
3. Enhanced privacy and reduced market impact
4. Reduced transaction costs

# Cons:

1. Potential for market manipulation
2. Regulatory concerns
3. Limited price discovery
4. Lack of transparency

# Learn more:

https://concordexlabs.medium.com/understanding-dark-pools-cryptos-hidden-trading-ecosystem-b2c11135f6f3
https://www.investopedia.com/articles/markets/050614/introduction-dark-pools.asp
https://docs.renegade.fi/core-concepts/dark-pool-explainer
https://chatgpt.com/c/3c519810-d772-4a26-82a4-3d7e8da371bb

# Todo:

1. Ensure that the dark pool created through Milady Pool complies with the stringent regularity requirements similar to those imposed on traditional stock exchanges. This includes the necessity to register with the Securities and Exchange Comission (SEC) and provide specific information about the operations of this protocol.

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
