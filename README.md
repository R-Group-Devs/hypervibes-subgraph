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

## Additional Info

For all currently deploy subgraphs, see:

* https://docs.hypervibes.xyz/developers/links-and-repos

For example queries, see:

* https://docs.hypervibes.xyz/developers/subgraph
