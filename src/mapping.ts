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
  const realm = new Realm(event.params.realmId.toString());
  realm.name = event.params.name;
  realm.description = event.params.description;
  realm.save();
}
