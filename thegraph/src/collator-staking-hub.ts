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


function genKey(address: string, votes: BigInt): string {
  const _stdAddr = address.toLowerCase().replace('0x', '');
  const _stdVotes = votes.toHex().replace('0x', '').padStart(64, '0');
  return `${_stdVotes}-${_stdAddr}`.toLowerCase();
}

export function handleAddCollator(event: AddCollatorEvent): void {
  const entity = new AddCollator(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex().toLowerCase()
  )
  entity.cur = event.params.cur.toHex().toLowerCase()
  entity.votes = event.params.votes
  entity.prev = event.params.prev.toHex().toLowerCase()

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash.toHex().toLowerCase()
  entity.save()

  const curCollator = CollatorSet.load(entity.cur);

  const newCollatorInfo = new CollatorSet(entity.cur);
  newCollatorInfo.address = entity.cur;
  newCollatorInfo.prev = entity.prev;
  newCollatorInfo.key = genKey(entity.cur, entity.votes);
  newCollatorInfo.votes = entity.votes;
  newCollatorInfo.inset = 1;
  newCollatorInfo.blockNumber = entity.blockNumber;
  newCollatorInfo.logIndex = event.logIndex;
  newCollatorInfo.blockTimestamp = entity.blockTimestamp;
  
  newCollatorInfo.pool = curCollator ? curCollator.pool : null;
  newCollatorInfo.commission = curCollator ? curCollator.commission : null;
  newCollatorInfo.assets = curCollator ? curCollator.assets : BigInt.zero();
  newCollatorInfo.reward = curCollator ? curCollator.reward : BigInt.zero();
  
  newCollatorInfo.save();

}

export function handleCommissionUpdated(event: CommissionUpdatedEvent): void {
  const entity = new CommissionUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex().toLowerCase()
  )
  entity.collator = event.params.collator.toHex().toLowerCase()
  entity.commission = event.params.commission

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash.toHex().toLowerCase()

  entity.save()

  let storedCollator = CollatorSet.load(entity.collator);
  if (storedCollator) {
    storedCollator.commission = entity.commission;
    storedCollator.save();
    return;
  }
  storedCollator = new CollatorSet(entity.collator);
  storedCollator.address = entity.collator;
  storedCollator.commission = entity.commission;
  storedCollator.assets = BigInt.zero();
  storedCollator.inset = 1;
  storedCollator.save();
}

export function handleInitialized(event: InitializedEvent): void {
  const entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex().toLowerCase()
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash.toHex().toLowerCase()

  entity.save()
}

export function handleNominationPoolCreated(
  event: NominationPoolCreatedEvent
): void {
  const entity = new NominationPoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex().toLowerCase()
  )
  entity.pool = event.params.pool.toHex().toLowerCase()
  entity.collator = event.params.collator.toHex().toLowerCase()

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash.toHex().toLowerCase()

  entity.save()


  let storedCollator = CollatorSet.load(entity.collator);
  if (storedCollator) {
    storedCollator.pool = entity.pool;
    storedCollator.save();
    return;
  }

  storedCollator = new CollatorSet(entity.collator);
  storedCollator.address = entity.collator;
  storedCollator.pool = entity.pool;
  storedCollator.assets = BigInt.zero();
  storedCollator.inset = 1;
  storedCollator.save();
}

export function handleRemoveCollator(event: RemoveCollatorEvent): void {
  const entity = new RemoveCollator(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex().toLowerCase()
  )
  entity.cur = event.params.cur.toHex().toLowerCase()
  entity.prev = event.params.prev.toHex().toLowerCase()

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash.toHex().toLowerCase()

  entity.save()


  let storedCollator = CollatorSet.load(entity.cur);
  if (storedCollator) {
    storedCollator.inset = 0;
    storedCollator.votes = null;
    storedCollator.prev = null;
    storedCollator.save();
    return;
  }
}

export function handleRewardDistributed(event: RewardDistributedEvent): void {
  const entity = new RewardDistributed(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex().toLowerCase()
  )
  entity.collator = event.params.collator.toHex().toLowerCase()
  entity.reward = event.params.reward

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash.toHex().toLowerCase()

  entity.save()


  let storedCollator = CollatorSet.load(entity.collator);
  if (storedCollator) {
    storedCollator.reward = entity.reward;
    storedCollator.save();
    return;
  }
}

export function handleStaked(event: StakedEvent): void {
  const entity = new Staked(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex().toLowerCase()
  )
  entity.pool = event.params.pool.toHex().toLowerCase()
  entity.collator = event.params.collator.toHex().toLowerCase()
  entity.account = event.params.account.toHex().toLowerCase()
  entity.assets = event.params.assets

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash.toHex().toLowerCase()

  entity.save()


  const _stakingAccountId = `${entity.collator}_${entity.account}`;
  let storedStakingAccount = StakingAccount.load(_stakingAccountId);
  if (!storedStakingAccount) {
    storedStakingAccount = new StakingAccount(_stakingAccountId);
    storedStakingAccount.pool = entity.pool;
    storedStakingAccount.collator = entity.collator;
    storedStakingAccount.account = entity.account;
    storedStakingAccount.assets = BigInt.zero();
  }
  storedStakingAccount.assets = storedStakingAccount.assets.plus(entity.assets);
  storedStakingAccount.save();


  let storedCollator = CollatorSet.load(entity.collator);
  if (storedCollator) {
    storedCollator.assets = (storedCollator.assets ? storedCollator.assets! : BigInt.zero()).plus(entity.assets);
    storedCollator.save();
  }
}

export function handleUnstaked(event: UnstakedEvent): void {
  const entity = new Unstaked(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex().toLowerCase()
  )
  entity.pool = event.params.pool.toHex().toLowerCase()
  entity.collator = event.params.collator.toHex().toLowerCase()
  entity.account = event.params.account.toHex().toLowerCase()
  entity.assets = event.params.assets

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash.toHex().toLowerCase()

  entity.save()


  const _stakingAccountId = `${entity.collator}_${entity.account}`;
  let storedStakingAccount = StakingAccount.load(_stakingAccountId);
  if (!storedStakingAccount) {
    storedStakingAccount = new StakingAccount(_stakingAccountId);
    storedStakingAccount.pool = entity.pool;
    storedStakingAccount.collator = entity.collator;
    storedStakingAccount.account = entity.account;
    storedStakingAccount.assets = BigInt.zero();
  }
  storedStakingAccount.assets = storedStakingAccount.assets.div(entity.assets);
  storedStakingAccount.save();


  let storedCollator = CollatorSet.load(entity.collator);
  if (storedCollator) {
    storedCollator.assets = (storedCollator.assets ? storedCollator.assets! : BigInt.zero()).div(entity.assets);
    storedCollator.save();
  }
}

export function handleUpdateCollator(event: UpdateCollatorEvent): void {
  const entity = new UpdateCollator(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex().toLowerCase()
  )
  entity.cur = event.params.cur.toHex().toLowerCase()
  entity.votes = event.params.votes
  entity.oldPrev = event.params.oldPrev.toHex().toLowerCase()
  entity.newPrev = event.params.newPrev.toHex().toLowerCase()

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash.toHex().toLowerCase()

  entity.save()


  let storedCollator = CollatorSet.load(entity.cur);
  if (storedCollator) {
    storedCollator.votes = entity.votes;
    storedCollator.key = genKey(entity.cur, entity.votes);
    storedCollator.prev = entity.newPrev;
    storedCollator.blockNumber = event.block.number;
    storedCollator.blockTimestamp = event.block.timestamp;
    storedCollator.logIndex = event.logIndex;
    storedCollator.save();
  }
}
