/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */

import {
  CollatorSet,
  CollatorStakingHub,
  CollatorStakingHub_AddCollator,
  CollatorStakingHub_CommissionUpdated,
  CollatorStakingHub_Initialized,
  CollatorStakingHub_NominationPoolCreated,
  CollatorStakingHub_RemoveCollator,
  CollatorStakingHub_RewardDistributed,
  CollatorStakingHub_Staked,
  CollatorStakingHub_Unstaked,
  CollatorStakingHub_UpdateCollator,
  StakingAccount,
} from "generated";


// # ===== collators

CollatorStakingHub.AddCollator.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const cur = event.params.cur;
  const prev = event.params.prev;
  const votes = event.params.votes;
  const blockNumber = BigInt(event.block.number);
  const logIndex = event.logIndex;
  const blockTimestamp = BigInt(event.block.timestamp);

  const entity: CollatorStakingHub_AddCollator = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    cur,
    votes,
    prev,
    chainId,
    blockNumber,
    logIndex,
    blockTimestamp,
  };
  context.CollatorStakingHub_AddCollator.set(entity);

  const storedCollator = await context.CollatorSet.get(cur);
  const prevCollator = await context.CollatorSet.get(prev);
  const baseCollator = {
    prev,
    seq: prevCollator ? ((prevCollator.seq ?? 0) + 1) : 0,
    votes,
    inset: 1,
    chainId,
    blockNumber,
    logIndex,
    blockTimestamp,
  };
  if (storedCollator) {
    context.CollatorSet.set({...storedCollator, ...baseCollator});
  } else {
    const newCollator: CollatorSet = {
      ...baseCollator,
      id: cur,
      address: cur,

      pool: undefined,
      commission: undefined,
      assets: 0n,
      reward: undefined,
    };
    context.CollatorSet.set(newCollator);
  }
});


CollatorStakingHub.RemoveCollator.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const cur = event.params.cur;
  const entity: CollatorStakingHub_RemoveCollator = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    cur,
    prev: event.params.prev,
    chainId,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };
  context.CollatorStakingHub_RemoveCollator.set(entity);

  const storedCollator = await context.CollatorSet.get(cur);
  if (storedCollator) {
    context.CollatorSet.set({
      ...storedCollator,
      inset: 0,
      votes: undefined,
      prev: undefined,
      seq: undefined,
    });
  }
});


CollatorStakingHub.UpdateCollator.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const cur = event.params.cur;
  const oldPrev = event.params.oldPrev;
  const newPrev = event.params.newPrev;
  const votes = event.params.votes;
  const entity: CollatorStakingHub_UpdateCollator = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    votes,
    cur,
    oldPrev,
    newPrev,
    chainId,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };
  context.CollatorStakingHub_UpdateCollator.set(entity);

  const storedCollator = await context.CollatorSet.get(cur);
  const newPrevCollator = await context.CollatorSet.get(newPrev);
  if (storedCollator) {
    const curCollator: CollatorSet = {
      ...storedCollator,
      seq: newPrevCollator ? (newPrevCollator.seq ?? 0) + 1 : 0,
      votes,
      prev: newPrev,
      blockNumber: BigInt(event.block.number),
      logIndex: event.logIndex,
      blockTimestamp: BigInt(event.block.timestamp),
    };
    context.CollatorSet.set(curCollator);
  }
});

CollatorStakingHub.RewardDistributed.handler(async ({event, context}) => {
  const collator = event.params.collator;
  const reward = event.params.reward;
  const entity: CollatorStakingHub_RewardDistributed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    collator,
    reward,
  };
  context.CollatorStakingHub_RewardDistributed.set(entity);

  const storedCollator = await context.CollatorSet.get(collator);
  if (storedCollator) {
    context.CollatorSet.set({
      ...storedCollator,
      reward,
    });
  }
});

// # ===== staking


CollatorStakingHub.CommissionUpdated.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const collator = event.params.collator;
  const commission = event.params.commission;
  const blockNumber = BigInt(event.block.number);
  const logIndex = event.logIndex;
  const blockTimestamp = BigInt(event.block.timestamp);

  const entity: CollatorStakingHub_CommissionUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    collator,
    commission,
    chainId,
    blockNumber,
    logIndex,
    blockTimestamp,
  };
  context.CollatorStakingHub_CommissionUpdated.set(entity);

  const storedCollator = await context.CollatorSet.get(collator);
  if (storedCollator) {
    context.CollatorSet.set({...storedCollator, commission});
  } else {
    context.CollatorSet.set({
      id: collator,
      address: collator,
      prev: undefined,
      seq: undefined,
      votes: undefined,
      pool: undefined,
      commission,
      assets: 0n,
      inset: 1,
      reward: undefined,
      chainId,
      blockNumber,
      logIndex,
      blockTimestamp,
    });
  }
});

CollatorStakingHub.Initialized.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const entity: CollatorStakingHub_Initialized = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    version: event.params.version,
    chainId,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };

  context.CollatorStakingHub_Initialized.set(entity);
});

CollatorStakingHub.NominationPoolCreated.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const pool = event.params.pool;
  const collator = event.params.collator;
  const blockNumber = BigInt(event.block.number);
  const logIndex = event.logIndex;
  const blockTimestamp = BigInt(event.block.timestamp);

  const entity: CollatorStakingHub_NominationPoolCreated = {
    id: pool,
    pool,
    collator,
    chainId,
    blockNumber,
    logIndex,
    blockTimestamp,
  };
  context.CollatorStakingHub_NominationPoolCreated.set(entity);

  const storedCollator = await context.CollatorSet.get(collator);
  if (storedCollator) {
    context.CollatorSet.set({...storedCollator, pool});
  } else {
    context.CollatorSet.set({
      id: collator,
      address: collator,
      prev: undefined,
      seq: undefined,
      votes: undefined,
      pool,
      commission: undefined,
      assets: 0n,
      reward: undefined,
      inset: 1,
      chainId,
      blockNumber,
      logIndex,
      blockTimestamp,
    });
  }
});

CollatorStakingHub.Staked.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const pool = event.params.pool;
  const collator = event.params.collator;
  const account = event.params.account;
  const assets = event.params.assets;

  const entity: CollatorStakingHub_Staked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pool,
    collator,
    account,
    assets,
    chainId,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };
  context.CollatorStakingHub_Staked.set(entity);

  // staking account
  const _stakingAccountId = `${collator}_${account}`;
  const storedStakingAccount = await context.StakingAccount.get(_stakingAccountId);
  context.StakingAccount.set({
    id: _stakingAccountId,
    pool,
    collator,
    account,
    assets: (storedStakingAccount?.assets ?? 0n) + assets,
    chainId,
  });

  // staking collator
  const storedCollator = await context.CollatorSet.get(collator);
  if (storedCollator) {
    context.CollatorSet.set({
      ...storedCollator,
      assets: (storedCollator.assets ?? 0n) + assets,
    });
  }
});

CollatorStakingHub.Unstaked.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const pool = event.params.pool;
  const collator = event.params.collator;
  const account = event.params.account;
  const assets = event.params.assets;

  const entity: CollatorStakingHub_Unstaked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pool,
    collator,
    account,
    assets,
    chainId,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };
  context.CollatorStakingHub_Unstaked.set(entity);

  // staking account
  const _stakingAccountId = `${pool}_${collator}_${account}`;
  const storedStakingAccount = await context.StakingAccount.get(_stakingAccountId);
  if (storedStakingAccount) {
    const stakingAccount: StakingAccount = {
      id: _stakingAccountId,
      pool,
      collator,
      account,
      assets: storedStakingAccount.assets - assets,
      chainId,
    };
    context.StakingAccount.set(stakingAccount);
  }

  // staking collator
  const storedCollator = await context.CollatorSet.get(collator);
  if (storedCollator) {
    context.CollatorSet.set({
      ...storedCollator,
      assets: (storedCollator?.assets ?? 0n) - assets,
    });
  }
});
