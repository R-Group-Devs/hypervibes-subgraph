import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Account, Collection, Infusion, NFT, Token } from '../generated/schema'
import { ERC721Datasource } from "../generated/templates";
import { ERC721 } from "../generated/HyperVIBES/ERC721";
import { ERC20 } from "../generated/HyperVIBES/ERC20";

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

  const contract = ERC721.bind(collectionAddress);

  collection = new Collection(id);
  collection.address = id;
  collection.name = contract.try_name().value;
  collection.symbol = contract.try_symbol().value;
  collection.save();

  // create a new data source to watch transfer events and update nft owners
  ERC721Datasource.create(collectionAddress);

  return collection;
}

export const getOrCreateNft = (collectionAddress: Address, tokenId: BigInt): NFT => {
  const collection = getOrCreateCollection(collectionAddress);
  const nftId = `${collection.id}-${tokenId}`;
  let nft = NFT.load(nftId);
  if (nft != null) {
    return nft;
  }

  const contract = ERC721.bind(collectionAddress);

  nft = new NFT(nftId);
  nft.tokenId = tokenId;
  nft.collection = collection.id;
  nft.owner = getOrCreateAccount(contract.ownerOf(tokenId)).id;
  nft.tokenUri = contract.try_tokenURI(tokenId).value;
  nft.save();
  return nft;
}

export const getOrCreateToken = (tokenAddress: Address): Token => {
  const tokenId = tokenAddress.toHexString();
  let token = Token.load(tokenId);
  if (token != null) {
    return token;
  }

  token = new Token(tokenId);
  token.address = tokenId;

  const contract = ERC20.bind(tokenAddress);
  token.symbol = contract.try_symbol().value;
  token.decimals = contract.try_decimals().value;
  token.save();
  return token;
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
