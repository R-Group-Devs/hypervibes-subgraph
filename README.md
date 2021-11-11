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
* Rinkeby - https://thegraph.com/hosted-service/subgraph/r-group-devs/hypervibes-rinkeby

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
  realms(orderBy: createdAtTimestamp, orderDirection: desc) {
    id
    name
    description
    token
    createdAtTimestamp
  }
}
```

Get details about all infusions across all realms for a given NFT:

```graphql
{
  nfts(where: { collection: "0xc0877d217b1b83a3347c1703032ae1e013a8fd9f" tokenId: "11" }) {
    tokenId
    collection { address }
    owner { address }

    # there will be 1 Infusion entity for-each Realm this NFT is infused in
    infusions {
      realm { id name }
      balance
      lastClaimAtTimestamp

      # all discrete infusion and claim events will be here
      events {
        eventType
        amount
        msgSender { address }
        target { address }
        createdAtTimestamp
      }
    }
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
    dailyRate

    # constraints

    minInfusionAmount
    maxInfusionAmount
    maxTokenBalance
    allowMultiInfuse
    allowPublicInfusion
    allowAllCollections
    requireNftIsOwned

    # configuration

    realmAdmins { account { address } }
    realmInfusers { account { address } }
    realmCollections { collection { address } }

    # get all infused nfts, balances, info, and events (claims and infusions)

    infusions {
      balance
      lastClaimAtTimestamp
      nft { tokenId collection { address } owner { address } }
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

Get information about a specific account:

```graphql
{
  account(id:"0xa34c3476ae0c4863fc39e32c0e666219503bed9f") {
    address

    # realms this account is admin for
    realmAdmins { realm { id name } }

    # realms this account is an infuser for
    realmInfusers { realm { id name } }

    # realms this account has created
    createdRealms {id name}

    # any accounts this account can infuse on behalf of
    infusionProxiesAsProxy { realm { id name } infuser { address } }

    # any accounts that can infuse on behalf of this account
    infusionProxiesAsInfuser { realm { id name } proxy { address } }

    # all nfts owned by this account that have been infused across all realms
    ownedNFTs {
      tokenId
      collection { address }
      infusions { realm { id name } balance }
    }

    # find all discrete infusions this account has executed
    infusionEventsAsTarget(where:{ eventType: INFUSE }) {
      amount
      infusion {
        realm { id name }
        nft { tokenId collection {address} }
      }
    }
  }
}
```



