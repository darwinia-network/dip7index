import {
  AddCollator as AddCollatorEvent,
  CommissionUpdated as CommissionUpdatedEvent,
  Initialized as InitializedEvent,
  NominationPoolCreated as NominationPoolCreatedEvent,
  RemoveCollator as RemoveCollatorEvent,
  RewardDistributed as RewardDistributedEvent,
  Staked as StakedEvent,
  Unstaked as UnstakedEvent,
  UpdateCollator as UpdateCollatorEvent
} from "../generated/CollatorStakingHub/CollatorStakingHub"
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
} from "../generated/schema"

export function handleAddCollator(event: AddCollatorEvent): void {
  let entity = new AddCollator(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.cur = event.params.cur
  entity.votes = event.params.votes
  entity.prev = event.params.prev

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCommissionUpdated(event: CommissionUpdatedEvent): void {
  let entity = new CommissionUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.collator = event.params.collator
  entity.commission = event.params.commission

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNominationPoolCreated(
  event: NominationPoolCreatedEvent
): void {
  let entity = new NominationPoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.pool = event.params.pool
  entity.collator = event.params.collator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRemoveCollator(event: RemoveCollatorEvent): void {
  let entity = new RemoveCollator(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.cur = event.params.cur
  entity.prev = event.params.prev

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardDistributed(event: RewardDistributedEvent): void {
  let entity = new RewardDistributed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.collator = event.params.collator
  entity.reward = event.params.reward

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStaked(event: StakedEvent): void {
  let entity = new Staked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.pool = event.params.pool
  entity.collator = event.params.collator
  entity.account = event.params.account
  entity.assets = event.params.assets

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnstaked(event: UnstakedEvent): void {
  let entity = new Unstaked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.pool = event.params.pool
  entity.collator = event.params.collator
  entity.account = event.params.account
  entity.assets = event.params.assets

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateCollator(event: UpdateCollatorEvent): void {
  let entity = new UpdateCollator(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.cur = event.params.cur
  entity.votes = event.params.votes
  entity.oldPrev = event.params.oldPrev
  entity.newPrev = event.params.newPrev

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
