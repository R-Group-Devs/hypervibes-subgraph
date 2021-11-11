import { NFT } from "../generated/schema";
import { Transfer } from "../generated/templates/ERC721/ERC721";
import { getOrCreateAccount } from "./entities";

export function handleTransfer(event: Transfer): void {
  const nftId = `${event.address.toHexString()}-${event.params.tokenId}`;
  const nft = NFT.load(nftId);

  if (nft == null) {
    return;
  }

  nft.owner = getOrCreateAccount(event.params.to).id;
  nft.save();
}
