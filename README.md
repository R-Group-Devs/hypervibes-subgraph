# hypervibes-subgraph

Subgraph for HyperVIBES project.

## Links

* [Product Brief](https://docs.google.com/document/d/1NvztqdMAyLERTPuX5uHSnq8f5G0YVRaxNsq5UaXhQEw/edit?usp=sharing)
* [MVP Coordination Doc](https://docs.google.com/document/d/1dpMlzGeO4XfD6gBQoaTTXO2NxCCfA0hDYlTinJjCsfQ/edit?usp=sharing)
* [Frontend repo](https://github.com/R-Group-Devs/hypervibes-frontend)
* [Contracts repo](https://github.com/R-Group-Devs/hypervibes-contracts)

## Current Deployments

* mainnet - N/A
* Polygon - N/A
* Ropsten - https://thegraph.com/hosted-service/subgraph/r-group-devs/hypervibes-ropsten

## Development

Install dependencies:

```
yarn
```

Generate AssemblyScript bindings from ABIs and graph schema:

```
yarn codegen
```

Ensure you have authorized with the graph-cli:

```
npx graph auth --product hosted-service $YOUR_AUTH_TOKEN
```

Deploy the subgraph:

```
yarn deploy
```
## Example Queries

You can use the hosted service UI, or any GraphQL IDE, to explore the schema and
possible queries via interactive introspection.

Get a list of all Realms:

```graphql
{
  realms(orderBy: modifiedAtBlock, orderDirection: desc) {
    id
    name
    description
    token
    modifiedAtTimestamp
    createdAtTimestamp
  }
}
```

Get details and infused NFTs about a specific realm:

```graphql
{
  realm(id: "3") {
    id
    name
    description
    token
    createdAtBlock
    createdAtTimestamp
    modifiedAtBlock
    modifiedAtTimestamp
    minDailyRate
    maxDailyRate
    minInfusionAmount
    maxInfusionAmount
    maxTokenBalance
    allowMultiInfuse
    allowPublicInfusion
    allowAllCollections
    requireNftIsOwned
    realmAdmins { account { address } }
    realmInfusers { account { address } }
    realmCollections { collection { address } }
    infusions {
      balance
      dailyRate
      lastClaimAtTimestamp
      nft { tokenId collection { address } }
      events {
        createdAtTimestamp
        target { address }
        amount
        eventType
      }
    }
  }
}

```

