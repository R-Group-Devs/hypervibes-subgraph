import { Address, BigInt, store } from "@graphprotocol/graph-ts"
import {
  HyperVIBES,
  AdminAdded,
  AdminRemoved,
  Claimed,
  CollectionAdded,
  CollectionRemoved,
  Infused,
  InfuserAdded,
  InfuserRemoved,
  RealmCreated
} from "../generated/HyperVIBES/HyperVIBES"
import { Account, Collection, Infusion, NFT, Realm, RealmAdmin, RealmCollection, RealmInfuser } from '../generated/schema'

const getOrCreateAccount = (address: Address): Account => {
  const id = address.toHexString();
  let account = Account.load(id);
  if (account != null) {
    return account;
  }
  account = new Account(id);
  account.save();
  return account;
}

const getOrCreateCollection = (collectionAddress: Address): Collection => {
  const collectionId = collectionAddress.toHexString();
  let collection = Collection.load(collectionId);
  if (collection != null) {
    return collection;
  }
  collection = new Collection(collectionId);
  collection.save();
  return collection;
}

const getOrCreateNft = (collectionAddress: Address, tokenId: BigInt): NFT => {
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

export function handleAdminAdded(event: AdminAdded): void {
  const account = getOrCreateAccount(event.params.admin);
  const realmId = event.params.realmId.toString();
  const realmAdminId = `${realmId}-${account.id}`;
  const realmAdmin = new RealmAdmin(realmAdminId);
  realmAdmin.realm = realmId;
  realmAdmin.account = account.id;
  realmAdmin.createdAtBlock = event.block.number;
  realmAdmin.createdAtTimestamp = event.block.timestamp;
  realmAdmin.save();
}

export function handleAdminRemoved(event: AdminRemoved): void {
  const realmId = event.params.realmId.toString();
  const adminId = event.params.admin.toHexString();
  const realmCollectionId = `${realmId}-${adminId}`;
  store.remove('RealmAdmin', realmCollectionId)
}

export function handleClaimed(event: Claimed): void {
  // TODO
}

export function handleCollectionAdded(event: CollectionAdded): void {
  const collection = getOrCreateCollection(event.params.collection);
  const realmId = event.params.realmId.toString();
  const realmCollectionId = `${realmId}-${collection.id}`;
  const realmCollection = new RealmCollection(realmCollectionId);
  realmCollection.realm = realmId;
  realmCollection.collection = collection.id;
  realmCollection.createdAtBlock = event.block.number;
  realmCollection.createdAtTimestamp = event.block.timestamp;
  realmCollection.save();
}

export function handleCollectionRemoved(event: CollectionRemoved): void {
  const realmId = event.params.realmId.toString();
  const collectionId = event.params.collection.toHexString();
  const realmCollectionId = `${realmId}-${collectionId}`;
  store.remove('RealmCollection', realmCollectionId)
}

export function handleInfused(event: Infused): void {
  const nft = getOrCreateNft(event.params.collection, event.params.tokenId);

  const realmId = event.params.realmId.toString();
  const infusionId = `${realmId}-${nft.collection}-${nft.tokenId}`;
  let infusion = Infusion.load(infusionId);
  if (infusion == null) {
    infusion = new Infusion(infusionId);
    infusion.realm = realmId;
    infusion.nft = nft.id;
    infusion.dailyRate = event.params.dailyRate;
  }

  const contract = HyperVIBES.bind(event.address);
  const data = contract.tokenData(event.params.realmId, event.params.collection, event.params.tokenId);
  infusion.balance = data.value1;
  infusion.lastClaimAt = data.value2;

  infusion.save();
}

export function handleInfuserAdded(event: InfuserAdded): void {
  const account = getOrCreateAccount(event.params.infuser);
  const realmId = event.params.realmId.toString();
  const realmInfuserId = `${realmId}-${account.id}`;
  const realmInfuser = new RealmInfuser(realmInfuserId);
  realmInfuser.realm = realmId;
  realmInfuser.account = account.id;
  realmInfuser.createdAtBlock = event.block.number;
  realmInfuser.createdAtTimestamp = event.block.timestamp;
  realmInfuser.save();
}

export function handleInfuserRemoved(event: InfuserRemoved): void {
  const realmId = event.params.realmId.toString();
  const realmInfuserId = event.params.infuser.toHexString();
  const realmCollectionId = `${realmId}-${realmInfuserId}`;
  store.remove('RealmCollection', realmCollectionId)
}

export function handleRealmCreated(event: RealmCreated): void {
  const realmId = event.params.realmId;
  const realm = new Realm(realmId.toString());

  realm.name = event.params.name;
  realm.description = event.params.description;
  realm.createdAtBlock = event.block.number;
  realm.createdAtTimestamp = event.block.timestamp;
  realm.modifiedAtBlock = event.block.number;
  realm.modifiedAtTimestamp = event.block.timestamp;

  const contract = HyperVIBES.bind(event.address);
  const config = contract.realmConfig(realmId);
  const constraints = config.value1;

  realm.token = config.value0.toHexString();

  realm.minDailyRate = constraints.minDailyRate;
  realm.maxDailyRate = constraints.maxDailyRate;
  realm.minInfusionAmount = constraints.minInfusionAmount;
  realm.maxTokenBalance = constraints.maxTokenBalance;
  realm.requireNftIsOwned = constraints.requireNftIsOwned;
  realm.allowMultiInfuse = constraints.allowMultiInfuse;
  realm.allowPublicInfusion = constraints.allowPublicInfusion;
  realm.allowAllCollections = constraints.allowAllCollections;

  realm.save();
}
