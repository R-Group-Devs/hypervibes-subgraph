import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Account, Collection, Infusion, NFT } from '../generated/schema'

export const getOrCreateAccount = (address: Address): Account => {
  const id = address.toHexString();
  let account = Account.load(id);
  if (account != null) {
    return account;
  }
  account = new Account(id);
  account.address = id;
  account.save();
  return account;
}

export const getOrCreateCollection = (collectionAddress: Address): Collection => {
  const id = collectionAddress.toHexString();
  let collection = Collection.load(id);
  if (collection != null) {
    return collection;
  }
  collection = new Collection(id);
  collection.address = id;
  collection.save();
  return collection;
}

export const getOrCreateNft = (collectionAddress: Address, tokenId: BigInt): NFT => {
  const collection = getOrCreateCollection(collectionAddress);
  const nftId = `${collection.id}-${tokenId}`;
  let nft = NFT.load(nftId);
  if (nft != null) {
    return nft;
  }
  nft = new NFT(nftId);
  nft.tokenId = tokenId;
  nft.collection = collection.id;
  nft.save();
  return nft;
}

export const getOrCreateInfusion = (realmId: string, nft: NFT): Infusion => {
  const infusionId = `${realmId}-${nft.collection}-${nft.tokenId}`;
  let infusion = Infusion.load(infusionId);
  if (infusion != null) {
    return infusion;
  }
  infusion = new Infusion(infusionId);
  infusion.realm = realmId;
  infusion.nft = nft.id;
  infusion.save()
  return infusion;
}
