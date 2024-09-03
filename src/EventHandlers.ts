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
  const entity: CollatorStakingHub_AddCollator = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    cur,
    votes,
    prev,
    chainId,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };
  context.CollatorStakingHub_AddCollator.set(entity);

  const prevCollator = await context.CollatorSet.get(prev);
  const newCollator: CollatorSet = {
    id: cur,
    address: cur,
    prev,
    seq: prevCollator ? (prevCollator.seq + 1) : 0,
    votes: votes,

    pool: undefined,
    commission: undefined,
    assets: undefined,
    inactive: 0,

    chainId,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };
  context.CollatorSet.set(newCollator);
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
    context.CollatorSet.set({...storedCollator, inactive: 1});
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
  if (storedCollator && newPrevCollator) {
    const curCollator: CollatorSet = {
      ...storedCollator,
      seq: newPrevCollator.seq + 1,
      votes,
      prev: newPrev,
      blockNumber: BigInt(event.block.number),
      logIndex: event.logIndex,
      blockTimestamp: BigInt(event.block.timestamp),
    };
    context.CollatorSet.set(curCollator);
  }
});


// # ===== staking


CollatorStakingHub.CommissionUpdated.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const collator = event.params.collator;
  const commission = event.params.commission;
  const entity: CollatorStakingHub_CommissionUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    collator,
    commission,
    chainId,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };
  context.CollatorStakingHub_CommissionUpdated.set(entity);

  const storedCollator = await context.CollatorSet.get(collator);
  if (storedCollator) {
    const c = {...storedCollator, commission};
    context.CollatorSet.set(c);
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

  const entity: CollatorStakingHub_NominationPoolCreated = {
    id: pool,
    pool,
    collator,
    chainId,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };
  context.CollatorStakingHub_NominationPoolCreated.set(entity);


  const storedCollator = await context.CollatorSet.get(collator);
  if (storedCollator) {
    const c = {...storedCollator, pool};
    context.CollatorSet.set(c);
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
