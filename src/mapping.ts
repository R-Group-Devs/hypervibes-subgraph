import { store } from "@graphprotocol/graph-ts"
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
import { InfusionEvent, Realm, RealmAdmin, RealmCollection, RealmInfuser } from '../generated/schema'
import { getOrCreateAccount, getOrCreateCollection, getOrCreateInfusion, getOrCreateNft } from "./entities";

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
  realm.maxInfusionAmount = constraints.maxInfusionAmount;
  realm.maxTokenBalance = constraints.maxTokenBalance;
  realm.requireNftIsOwned = constraints.requireNftIsOwned;
  realm.allowMultiInfuse = constraints.allowMultiInfuse;
  realm.allowPublicInfusion = constraints.allowPublicInfusion;
  realm.allowAllCollections = constraints.allowAllCollections;

  realm.save();
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

export function handleAdminRemoved(event: AdminRemoved): void {
  const realmId = event.params.realmId.toString();
  const adminId = event.params.admin.toHexString();
  const realmAdminId = `${realmId}-${adminId}`;
  store.remove('RealmAdmin', realmAdminId)
}

export function handleInfuserRemoved(event: InfuserRemoved): void {
  const realmId = event.params.realmId.toString();
  const infuserId = event.params.infuser.toHexString();
  const realmInfuserId = `${realmId}-${infuserId}`;
  store.remove('RealmInufser', realmInfuserId)
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

  const infusion = getOrCreateInfusion(realmId, nft);
  const contract = HyperVIBES.bind(event.address);
  const data = contract.tokenData(event.params.realmId, event.params.collection, event.params.tokenId);
  infusion.dailyRate = event.params.dailyRate;
  infusion.balance = data.value1;
  infusion.lastClaimAtTimestamp = data.value2;
  infusion.save();

  // TODO: infusion events
  const eventId = `${event.block.hash}-${event.transaction.hash}-${event.logIndex}`;
  const infusionEvent = new InfusionEvent(eventId)
  infusionEvent.msgSender = event.transaction.from.toHexString();
  infusionEvent.amount = event.params.amount;
  infusionEvent.infusion = infusion.id;
  infusionEvent.eventType = "INFUSE";
  infusionEvent.target = event.params.infuser.toHexString();
  infusionEvent.transactionHash = event.transaction.hash.toHexString();
  infusionEvent.createdAtBlock = event.block.number;
  infusionEvent.createdAtTimestamp = event.block.timestamp;
  infusionEvent.comment = event.params.comment;
  infusionEvent.save();
}

export function handleClaimed(event: Claimed): void {
  // TODO
}




