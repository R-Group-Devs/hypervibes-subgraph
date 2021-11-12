# hypervibes-subgraph

Subgraph for HyperVIBES project.

## Links

* [Product Brief](https://docs.google.com/document/d/1NvztqdMAyLERTPuX5uHSnq8f5G0YVRaxNsq5UaXhQEw/edit?usp=sharing)
* [MVP Coordination Doc](https://docs.google.com/document/d/1dpMlzGeO4XfD6gBQoaTTXO2NxCCfA0hDYlTinJjCsfQ/edit?usp=sharing)
* [Frontend repo](https://github.com/R-Group-Devs/hypervibes-frontend)
* [Contracts repo](https://github.com/R-Group-Devs/hypervibes-contracts)

## Development

Install dependencies:

```
yarn
```

Prepare the manifest for a specific network (see `./config`):

```
NETWORK=rinkeby yarn prepare
```

Generate AssemblyScript bindings from ABIs and graph schema (this does not need
to be re-run for different networks, but prepare must be run at least once for
the bindings to generate):

```
yarn codegen
```

Ensure you have authorized with the graph-cli:

```
npx graph auth --product hosted-service $YOUR_AUTH_TOKEN
```

Deploy the subgraph to the prepared network:

```
NETWORK=rinkeby yarn deploy
```

## Additional Info

For all currently deploy subgraphs, see:

* https://docs.hypervibes.xyz/developers/links-and-repos

For example queries, see:

* https://docs.hypervibes.xyz/developers/subgraph
