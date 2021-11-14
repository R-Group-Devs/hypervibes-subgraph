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
  RealmCreated,
  ProxyAdded,
  ProxyRemoved,
  ClaimerAdded,
  ClaimerRemoved,
} from "../generated/HyperVIBES/HyperVIBES"
import { InfusionEvent, Realm, RealmAdmin, RealmCollection, RealmInfuser, Proxy, RealmClaimer } from '../generated/schema'
import { getOrCreateAccount, getOrCreateCollection, getOrCreateInfusion, getOrCreateNft, getOrCreateToken } from "./entities";

export function handleRealmCreated(event: RealmCreated): void {
  const realmId = event.params.realmId;
  const realm = new Realm(realmId.toString());

  realm.name = event.params.name;
  realm.description = event.params.description;
  realm.creator = getOrCreateAccount(event.transaction.from).id;
  realm.createdAtBlock = event.block.number;
  realm.createdAtTimestamp = event.block.timestamp;
  realm.createdAtTransactionHash = event.transaction.hash.toHexString();
  realm.modifiedAtBlock = event.block.number;
  realm.modifiedAtTimestamp = event.block.timestamp;

  const contract = HyperVIBES.bind(event.address);
  const config = contract.realmConfig(realmId);
  const constraints = config.value2;

  realm.token = getOrCreateToken(config.value0).id;
  realm.dailyRate = config.value1;

  realm.minInfusionAmount = constraints.minInfusionAmount;
  realm.maxTokenBalance = constraints.maxTokenBalance;
  realm.requireNftIsOwned = constraints.requireNftIsOwned;
  realm.allowMultiInfuse = constraints.allowMultiInfuse;
  realm.allowPublicInfusion = constraints.allowPublicInfusion;
  realm.allowPublicClaiming = constraints.allowPublicClaiming;
  realm.allowAllCollections = constraints.allowAllCollections;
  realm.minClaimAmount = constraints.minClaimAmount;

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
  realmAdmin.createdAtTransactionHash = event.transaction.hash.toHexString();
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
  realmInfuser.createdAtTransactionHash = event.transaction.hash.toHexString();
  realmInfuser.save();
}

export function handleClaimerAdded(event: ClaimerAdded): void {
  const account = getOrCreateAccount(event.params.claimer);
  const realmId = event.params.realmId.toString();
  const realmClaimerId = `${realmId}-${account.id}`;
  const realmClaimer = new RealmClaimer(realmClaimerId);
  realmClaimer.realm = realmId;
  realmClaimer.account = account.id;
  realmClaimer.createdAtBlock = event.block.number;
  realmClaimer.createdAtTimestamp = event.block.timestamp;
  realmClaimer.createdAtTransactionHash = event.transaction.hash.toHexString();
  realmClaimer.save();
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
  realmCollection.createdAtTransactionHash = event.transaction.hash.toHexString();
  realmCollection.save();
}

export function handleProxyAdded(event: ProxyAdded): void {
  const realmId = event.params.realmId.toString();
  const proxyAccount = getOrCreateAccount(event.params.proxy);
  const delegator = getOrCreateAccount(event.transaction.from);
  const proxyId = `${realmId}-${proxyAccount.id}-${delegator.id}`;
  const proxy = new Proxy(proxyId);
  proxy.realm = realmId;
  proxy.proxy = proxyAccount.id;
  proxy.delegator = delegator.id;
  proxy.createdAtBlock = event.block.number;
  proxy.createdAtTimestamp = event.block.timestamp;
  proxy.createdAtTransactionHash = event.transaction.hash.toString();
  proxy.save();
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

export function handleClaimerRemoved(event: ClaimerRemoved): void {
  const realmId = event.params.realmId.toString();
  const claimerId = event.params.claimer.toHexString();
  const realmClaimerId = `${realmId}-${claimerId}`;
  store.remove('RealmClaimer`', realmClaimerId)
}

export function handleCollectionRemoved(event: CollectionRemoved): void {
  const realmId = event.params.realmId.toString();
  const collectionId = event.params.collection.toHexString();
  const realmCollectionId = `${realmId}-${collectionId}`;
  store.remove('RealmCollection', realmCollectionId)
}

export function handleProxyRemoved(event: ProxyRemoved): void {
  const realmId = event.params.realmId.toString();
  const proxyAccountId = event.params.proxy.toHexString();
  const delegatorId = event.transaction.from.toHexString();
  const proxyId = `${realmId}-${proxyAccountId}-${delegatorId}`;
  store.remove('Proxy', proxyId);
}

export function handleInfused(event: Infused): void {
  const nft = getOrCreateNft(event.params.collection, event.params.tokenId);
  const realmId = event.params.realmId.toString();

  // update infusion with latest balance
  const infusion = getOrCreateInfusion(realmId, nft);
  const contract = HyperVIBES.bind(event.address);
  const data = contract.tokenData(event.params.realmId, event.params.collection, event.params.tokenId);
  infusion.balance = data.value0;
  infusion.lastClaimAtTimestamp = data.value1;
  infusion.save();

  // create the infusion event
  const eventId = `${event.block.hash}-${event.transaction.hash}-${event.logIndex}`;
  const infusionEvent = new InfusionEvent(eventId)
  infusionEvent.amount = event.params.amount;
  infusionEvent.infusion = infusion.id;
  infusionEvent.eventType = "INFUSE";
  infusionEvent.msgSender = getOrCreateAccount(event.transaction.from).id;
  infusionEvent.target = getOrCreateAccount(event.params.infuser).id;
  infusionEvent.createdAtBlock = event.block.number;
  infusionEvent.createdAtTimestamp = event.block.timestamp;
  infusionEvent.createdAtTransactionHash = event.transaction.hash.toHexString();
  infusionEvent.comment = event.params.comment;
  infusionEvent.save();
}

export function handleClaimed(event: Claimed): void {
  const nft = getOrCreateNft(event.params.collection, event.params.tokenId);
  const realmId = event.params.realmId.toString();

  const infusion = getOrCreateInfusion(realmId, nft);
  const contract = HyperVIBES.bind(event.address);
  const data = contract.tokenData(event.params.realmId, event.params.collection, event.params.tokenId);
  infusion.balance = data.value0;
  infusion.lastClaimAtTimestamp = data.value1;
  infusion.save();

  // create the infusion event
  const eventId = `${event.block.hash}-${event.transaction.hash}-${event.logIndex}`;
  const infusionEvent = new InfusionEvent(eventId)
  infusionEvent.amount = event.params.amount;
  infusionEvent.infusion = infusion.id;
  infusionEvent.eventType = "CLAIM";
  infusionEvent.msgSender = getOrCreateAccount(event.transaction.from).id;
  infusionEvent.target = getOrCreateAccount(event.transaction.from).id;
  infusionEvent.createdAtBlock = event.block.number;
  infusionEvent.createdAtTimestamp = event.block.timestamp;
  infusionEvent.createdAtTransactionHash = event.transaction.hash.toHexString();
  infusionEvent.comment = "";
  infusionEvent.save();
}




