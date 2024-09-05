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
  CollatorSet,
  CommissionUpdated,
  Initialized,
  NominationPoolCreated,
  RemoveCollator,
  RewardDistributed,
  Staked,
  StakingAccount,
  Unstaked,
  UpdateCollator
} from "../generated/schema"
import {BigInt} from "@graphprotocol/graph-ts";

export function handleAddCollator(event: AddCollatorEvent): void {
  const entity = new AddCollator(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.cur = event.params.cur
  entity.votes = event.params.votes
  entity.prev = event.params.prev

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  let storedCollator = CollatorSet.load(entity.cur.toString());
  const prevCollator = CollatorSet.load(entity.prev.toString());

  if (!storedCollator) {
    storedCollator = new CollatorSet(entity.cur.toString())
    storedCollator.address = entity.cur.toString();
    storedCollator.assets = BigInt.zero();
  }

  storedCollator.prev = entity.prev.toString();
  storedCollator.seq = prevCollator ? (prevCollator.seq + 1) : 0;
  storedCollator.votes = entity.votes;
  storedCollator.inset = 1;
  storedCollator.blockNumber = entity.blockNumber;
  storedCollator.logIndex = event.logIndex;
  storedCollator.blockTimestamp = entity.blockTimestamp;

  storedCollator.save();
}

export function handleCommissionUpdated(event: CommissionUpdatedEvent): void {
  const entity = new CommissionUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.collator = event.params.collator
  entity.commission = event.params.commission

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let storedCollator = CollatorSet.load(entity.collator.toString());
  if (storedCollator) {
    storedCollator.commission = entity.commission;
    storedCollator.save();
    return;
  }
  storedCollator = new CollatorSet(entity.collator.toString());
  storedCollator.address = entity.collator.toString();
  storedCollator.commission = entity.commission;
  storedCollator.assets = BigInt.fromI32(0);
  storedCollator.inset = 1;
  storedCollator.save();
}

export function handleInitialized(event: InitializedEvent): void {
  const entity = new Initialized(
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
  const entity = new NominationPoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.pool = event.params.pool
  entity.collator = event.params.collator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()


  let storedCollator = CollatorSet.load(entity.collator.toString());
  if (storedCollator) {
    storedCollator.pool = entity.pool.toString();
    storedCollator.save();
    return;
  }

  storedCollator = new CollatorSet(entity.collator.toString());
  storedCollator.address = entity.collator.toString();
  storedCollator.pool = entity.pool.toString();
  storedCollator.assets = BigInt.fromI32(0);
  storedCollator.inset = 1;
  storedCollator.save();
}

export function handleRemoveCollator(event: RemoveCollatorEvent): void {
  const entity = new RemoveCollator(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.cur = event.params.cur
  entity.prev = event.params.prev

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()


  let storedCollator = CollatorSet.load(entity.cur.toString());
  if (storedCollator) {
    storedCollator.inset = 0;
    storedCollator.votes = null;
    storedCollator.prev = null;
    storedCollator.seq = 9999;
    storedCollator.save();
    return;
  }
}

export function handleRewardDistributed(event: RewardDistributedEvent): void {
  const entity = new RewardDistributed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.collator = event.params.collator
  entity.reward = event.params.reward

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()


  let storedCollator = CollatorSet.load(entity.collator.toString());
  if (storedCollator) {
    storedCollator.reward = entity.reward;
    storedCollator.save();
    return;
  }
}

export function handleStaked(event: StakedEvent): void {
  const entity = new Staked(
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


  const _stakingAccountId = `${entity.collator.toString()}_${entity.account.toString()}`;
  let storedStakingAccount = StakingAccount.load(_stakingAccountId);
  if (!storedStakingAccount) {
    storedStakingAccount = new StakingAccount(_stakingAccountId);
    storedStakingAccount.pool = entity.pool.toString();
    storedStakingAccount.collator = entity.collator.toString();
    storedStakingAccount.account = entity.account.toString();
    storedStakingAccount.assets = BigInt.zero();
  }
  storedStakingAccount.assets = storedStakingAccount.assets.plus(entity.assets);
  storedStakingAccount.save();


  let storedCollator = CollatorSet.load(entity.collator.toString());
  if (storedCollator) {
    storedCollator.assets = (storedCollator.assets ? storedCollator.assets! : BigInt.zero()).plus(entity.assets);
    storedCollator.save();
  }
}

export function handleUnstaked(event: UnstakedEvent): void {
  const entity = new Unstaked(
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


  const _stakingAccountId = `${entity.collator.toString()}_${entity.account.toString()}`;
  let storedStakingAccount = StakingAccount.load(_stakingAccountId);
  if (!storedStakingAccount) {
    storedStakingAccount = new StakingAccount(_stakingAccountId);
    storedStakingAccount.pool = entity.pool.toString();
    storedStakingAccount.collator = entity.collator.toString();
    storedStakingAccount.account = entity.account.toString();
    storedStakingAccount.assets = BigInt.zero();
  }
  storedStakingAccount.assets = storedStakingAccount.assets.div(entity.assets);
  storedStakingAccount.save();


  let storedCollator = CollatorSet.load(entity.collator.toString());
  if (storedCollator) {
    storedCollator.assets = (storedCollator.assets ? storedCollator.assets! : BigInt.fromI32(0)).div(entity.assets);
    storedCollator.save();
  }
}

export function handleUpdateCollator(event: UpdateCollatorEvent): void {
  const entity = new UpdateCollator(
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


  let storedCollator = CollatorSet.load(entity.cur.toString());
  let prevCollator = CollatorSet.load(entity.newPrev.toString());
  if (storedCollator) {
    storedCollator.seq = prevCollator ? (prevCollator.seq) + 1 : 0;
    storedCollator.votes = entity.votes;
    storedCollator.prev = entity.newPrev.toString();
    storedCollator.blockNumber = event.block.number;
    storedCollator.blockTimestamp = event.block.timestamp;
    storedCollator.logIndex = event.logIndex;
    storedCollator.save();
  }
}
