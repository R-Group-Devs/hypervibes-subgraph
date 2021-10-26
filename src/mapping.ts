import { BigInt } from "@graphprotocol/graph-ts"
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
import { Realm } from '../generated/schema'

export function handleAdminAdded(event: AdminAdded): void { }

export function handleAdminRemoved(event: AdminRemoved): void { }

export function handleClaimed(event: Claimed): void { }

export function handleCollectionAdded(event: CollectionAdded): void { }

export function handleCollectionRemoved(event: CollectionRemoved): void { }

export function handleInfused(event: Infused): void { }

export function handleInfuserAdded(event: InfuserAdded): void { }

export function handleInfuserRemoved(event: InfuserRemoved): void { }

export function handleRealmCreated(event: RealmCreated): void {
  const realmId = event.params.realmId;
  const realm = new Realm(realmId.toString());

  realm.name = event.params.name;
  realm.description = event.params.description;
  realm.createdAt = event.block.number;
  realm.modifiedAt = event.block.number;

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
