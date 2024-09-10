import {
  CollatorSet,
  CollatorStakingHub_AddCollator,
  CollatorStakingHub_CommissionUpdated,
  CollatorStakingHub_NominationPoolCreated,
  CollatorStakingHub_RemoveCollator,
  CollatorStakingHub_RewardDistributed,
  CollatorStakingHub_Staked,
  CollatorStakingHub_Unstaked,
  CollatorStakingHub_UpdateCollator,
  handlerContext,
  StakingAccount
} from "generated";

function genKey(address: string, votes: bigint) {
  const _stdAddr = address.toLowerCase().replace('0x', '');
  const _stdVotes = votes.toString(16).padStart(64, '0');
  return `${_stdVotes}-${_stdAddr}`;
}

export async function addCollator(
  context: handlerContext,
  entity: CollatorStakingHub_AddCollator,
) {
  const curCollator = await context.CollatorSet.get(entity.cur);
  // const prevCollator = await context.CollatorSet.get(entity.prev);
  const newCollatorInfo: CollatorSet = {
    id: entity.cur,
    address: entity.cur,
    prev: entity.prev,
    key: genKey(entity.cur, entity.votes),
    votes: entity.votes,
    inset: 1,
    chainId: entity.chainId,
    blockNumber: entity.blockNumber,
    logIndex: entity.logIndex,
    blockTimestamp: entity.blockTimestamp,

    pool: undefined,
    commission: undefined,
    assets: 0n,
    reward: undefined,
  };
  if (curCollator) {
    context.CollatorSet.set({
      ...curCollator,
      ...newCollatorInfo,
    });
  } else {
    context.CollatorSet.set(newCollatorInfo);
  }
}

export async function removeCollator(
  context: handlerContext,
  entity: CollatorStakingHub_RemoveCollator,
) {
  const curCollator = await context.CollatorSet.get(entity.cur);
  if (!curCollator) {
    return;
  }
  const updateCollator = {
    ...curCollator,
    inset: 0,
    votes: undefined,
    prev: undefined,
    key: undefined,
  };
  context.CollatorSet.set(updateCollator);
}

export async function updateCollator(
  context: handlerContext,
  entity: CollatorStakingHub_UpdateCollator
) {
  // const collators = await _queryRawCollatorSet(context, entity.chainId);
  // const curCollator = _pickCollator(collators, {id: entity.cur});
  // const newPrevCollator = _pickCollator(collators, {id: entity.newPrev});

  const curCollator = await context.CollatorSet.get(entity.cur);
  if (!curCollator) {
    return;
  }
  const updateCollator = {
    ...curCollator,
    votes: entity.votes,
    key: genKey(entity.cur, entity.votes),
    blockNumber: entity.blockNumber,
    logIndex: entity.logIndex,
    blockTimestamp: entity.blockTimestamp,
  };
  context.CollatorSet.set(updateCollator);
}

export async function rewardDistributed(
  context: handlerContext,
  entity: CollatorStakingHub_RewardDistributed
) {
  const curCollator = await context.CollatorSet.get(entity.collator);
  if (!curCollator) return;
  context.CollatorSet.set({
    ...curCollator,
    reward: entity.reward,
  });
}

export async function commissionUpdated(
  context: handlerContext,
  entity: CollatorStakingHub_CommissionUpdated
) {
  // const collators = await _queryRawCollatorSet(context, entity.chainId);
  // let curCollator = _pickCollator(collators, {id: entity.collator});
  const curCollator = await context.CollatorSet.get(entity.collator);
  if (curCollator) {
    // _updateCollator(collators, {
    //   ...curCollator,
    //   commission: entity.commission,
    // });
    // _store(context, entity.chainId, collators);
    context.CollatorSet.set({
      ...curCollator,
      commission: entity.commission,
    });
    return;
  }
  // curCollator = ;
  // collators.splice(0, 0, curCollator);
  // _store(context, entity.chainId, collators);
  context.CollatorSet.set({
    id: entity.collator,
    address: entity.collator,
    prev: undefined,
    key: undefined,
    votes: undefined,
    pool: undefined,
    commission: entity.commission,
    assets: 0n,
    inset: 1,
    reward: undefined,
    chainId: entity.chainId,
    blockNumber: entity.blockNumber,
    logIndex: entity.logIndex,
    blockTimestamp: entity.blockTimestamp,
  });
}

export async function nominationPoolCreated(
  context: handlerContext,
  entity: CollatorStakingHub_NominationPoolCreated
) {
  // const collators = await _queryRawCollatorSet(context, entity.chainId);
  // let curCollator = _pickCollator(collators, {id: entity.collator});
  const curCollator = await context.CollatorSet.get(entity.collator);
  if (curCollator) {
    context.CollatorSet.set({
      ...curCollator,
      pool: entity.pool,
    });
    return;
  }
  context.CollatorSet.set({
    id: entity.collator,
    address: entity.collator,
    prev: undefined,
    key: undefined,
    votes: undefined,
    pool: entity.pool,
    commission: undefined,
    assets: 0n,
    inset: 1,
    reward: undefined,
    chainId: entity.chainId,
    blockNumber: entity.blockNumber,
    logIndex: entity.logIndex,
    blockTimestamp: entity.blockTimestamp,
  });
}

export async function staked(
  context: handlerContext,
  entity: CollatorStakingHub_Staked
) {
  // staking account
  const _stakingAccountId = `${entity.collator}_${entity.account}`;

  const storedStakingAccount = await context.StakingAccount.get(_stakingAccountId);
  context.StakingAccount.set({
    id: _stakingAccountId,
    pool: entity.pool,
    collator: entity.collator,
    account: entity.account,
    assets: BigInt(storedStakingAccount?.assets ?? 0) + entity.assets,
    chainId: entity.chainId
  });


  // staking collator
  const curCollator = await context.CollatorSet.get(entity.collator);
  if (curCollator) {
    context.CollatorSet.set({
      ...curCollator,
      assets: (curCollator.assets ?? 0n) + entity.assets,
    });
  }
}

export async function unstaked(
  context: handlerContext,
  entity: CollatorStakingHub_Unstaked
) {
  // staking account
  const _stakingAccountId = `${entity.collator}_${entity.account}`;
  const storedStakingAccount = await context.StakingAccount.get(_stakingAccountId);
  if (storedStakingAccount) {
    const stakingAccount: StakingAccount = {
      id: _stakingAccountId,
      pool: entity.pool,
      collator: entity.collator,
      account: entity.account,
      assets: storedStakingAccount.assets - entity.assets,
      chainId: entity.chainId,
    };
    context.StakingAccount.set(stakingAccount);
  }

  // staking collator

  const curCollator = await context.CollatorSet.get(entity.collator);
  if (curCollator) {
    context.CollatorSet.set({
      ...curCollator,
      assets: (curCollator.assets ?? 0n) - entity.assets,
    });
  }
}


