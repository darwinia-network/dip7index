import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AddCollator,
  CommissionUpdated,
  Initialized,
  NominationPoolCreated,
  RemoveCollator,
  RewardDistributed,
  Staked,
  Unstaked,
  UpdateCollator
} from "../generated/CollatorStakingHub/CollatorStakingHub"

export function createAddCollatorEvent(
  cur: Address,
  votes: BigInt,
  prev: Address
): AddCollator {
  let addCollatorEvent = changetype<AddCollator>(newMockEvent())

  addCollatorEvent.parameters = new Array()

  addCollatorEvent.parameters.push(
    new ethereum.EventParam("cur", ethereum.Value.fromAddress(cur))
  )
  addCollatorEvent.parameters.push(
    new ethereum.EventParam("votes", ethereum.Value.fromUnsignedBigInt(votes))
  )
  addCollatorEvent.parameters.push(
    new ethereum.EventParam("prev", ethereum.Value.fromAddress(prev))
  )

  return addCollatorEvent
}

export function createCommissionUpdatedEvent(
  collator: Address,
  commission: BigInt
): CommissionUpdated {
  let commissionUpdatedEvent = changetype<CommissionUpdated>(newMockEvent())

  commissionUpdatedEvent.parameters = new Array()

  commissionUpdatedEvent.parameters.push(
    new ethereum.EventParam("collator", ethereum.Value.fromAddress(collator))
  )
  commissionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "commission",
      ethereum.Value.fromUnsignedBigInt(commission)
    )
  )

  return commissionUpdatedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createNominationPoolCreatedEvent(
  pool: Address,
  collator: Address
): NominationPoolCreated {
  let nominationPoolCreatedEvent = changetype<NominationPoolCreated>(
    newMockEvent()
  )

  nominationPoolCreatedEvent.parameters = new Array()

  nominationPoolCreatedEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  nominationPoolCreatedEvent.parameters.push(
    new ethereum.EventParam("collator", ethereum.Value.fromAddress(collator))
  )

  return nominationPoolCreatedEvent
}

export function createRemoveCollatorEvent(
  cur: Address,
  prev: Address
): RemoveCollator {
  let removeCollatorEvent = changetype<RemoveCollator>(newMockEvent())

  removeCollatorEvent.parameters = new Array()

  removeCollatorEvent.parameters.push(
    new ethereum.EventParam("cur", ethereum.Value.fromAddress(cur))
  )
  removeCollatorEvent.parameters.push(
    new ethereum.EventParam("prev", ethereum.Value.fromAddress(prev))
  )

  return removeCollatorEvent
}

export function createRewardDistributedEvent(
  collator: Address,
  reward: BigInt
): RewardDistributed {
  let rewardDistributedEvent = changetype<RewardDistributed>(newMockEvent())

  rewardDistributedEvent.parameters = new Array()

  rewardDistributedEvent.parameters.push(
    new ethereum.EventParam("collator", ethereum.Value.fromAddress(collator))
  )
  rewardDistributedEvent.parameters.push(
    new ethereum.EventParam("reward", ethereum.Value.fromUnsignedBigInt(reward))
  )

  return rewardDistributedEvent
}

export function createStakedEvent(
  pool: Address,
  collator: Address,
  account: Address,
  assets: BigInt
): Staked {
  let stakedEvent = changetype<Staked>(newMockEvent())

  stakedEvent.parameters = new Array()

  stakedEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam("collator", ethereum.Value.fromAddress(collator))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )

  return stakedEvent
}

export function createUnstakedEvent(
  pool: Address,
  collator: Address,
  account: Address,
  assets: BigInt
): Unstaked {
  let unstakedEvent = changetype<Unstaked>(newMockEvent())

  unstakedEvent.parameters = new Array()

  unstakedEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )
  unstakedEvent.parameters.push(
    new ethereum.EventParam("collator", ethereum.Value.fromAddress(collator))
  )
  unstakedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  unstakedEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )

  return unstakedEvent
}

export function createUpdateCollatorEvent(
  cur: Address,
  votes: BigInt,
  oldPrev: Address,
  newPrev: Address
): UpdateCollator {
  let updateCollatorEvent = changetype<UpdateCollator>(newMockEvent())

  updateCollatorEvent.parameters = new Array()

  updateCollatorEvent.parameters.push(
    new ethereum.EventParam("cur", ethereum.Value.fromAddress(cur))
  )
  updateCollatorEvent.parameters.push(
    new ethereum.EventParam("votes", ethereum.Value.fromUnsignedBigInt(votes))
  )
  updateCollatorEvent.parameters.push(
    new ethereum.EventParam("oldPrev", ethereum.Value.fromAddress(oldPrev))
  )
  updateCollatorEvent.parameters.push(
    new ethereum.EventParam("newPrev", ethereum.Value.fromAddress(newPrev))
  )

  return updateCollatorEvent
}
