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
  StakingCollator,
  StakingNomination,
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

  context.CollatorSet.deleteUnsafe(cur);
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

  // const oldPrevCollator = await context.CollatorSet.get(oldPrev);
  const newPrevCollator = await context.CollatorSet.get(newPrev);
  if (newPrevCollator) {
    const curCollator: CollatorSet = {
      id: cur,
      address: cur,
      seq: newPrevCollator.seq + 1,
      votes: votes,
      prev: newPrev,
      chainId,
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
  const entity: CollatorStakingHub_CommissionUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    collator: event.params.collator,
    commission: event.params.commission,
    chainId,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };

  context.CollatorStakingHub_CommissionUpdated.set(entity);
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

  const _stakingAccountId = `${pool}_${collator}_${account}`;
  const _stakingCollatorId = `${pool}_${collator}`;
  const _stakingNominationId = pool;
  const storedStakingAccount = await context.StakingAccount.get(_stakingCollatorId);
  const storedStakingCollator = await context.StakingCollator.get(_stakingCollatorId);
  const storedStakingNomination = await context.StakingNomination.get(_stakingNominationId);
  const stakingAccount: StakingAccount = {
    id: _stakingAccountId,
    pool,
    collator,
    account,
    assets: (storedStakingAccount?.assets ?? 0n) + assets,
    chainId,
  };
  const stakingCollator: StakingCollator = {
    id: _stakingCollatorId,
    pool,
    collator,
    assets: (storedStakingCollator?.assets ?? 0n) + assets,
    chainId,
  };
  const stakingNomination: StakingNomination = {
    id: _stakingNominationId,
    pool,
    assets: (storedStakingNomination?.assets ?? 0n) + assets,
    chainId,
  };
  context.StakingAccount.set(stakingAccount);
  context.StakingCollator.set(stakingCollator);
  context.StakingNomination.set(stakingNomination);
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


  const _stakingAccountId = `${pool}_${collator}_${account}`;
  const _stakingCollatorId = `${pool}_${collator}`;
  const _stakingNominationId = pool;
  const storedStakingAccount = await context.StakingAccount.get(_stakingCollatorId);
  const storedStakingCollator = await context.StakingCollator.get(_stakingCollatorId);
  const storedStakingNomination = await context.StakingNomination.get(_stakingNominationId);
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
  if (storedStakingCollator) {
    const stakingCollator: StakingCollator = {
      id: _stakingCollatorId,
      pool,
      collator,
      assets: storedStakingCollator.assets - assets,
      chainId,
    };
    context.StakingCollator.set(stakingCollator);
  }
  if (storedStakingNomination) {
    const stakingNomination: StakingNomination = {
      id: _stakingNominationId,
      pool,
      assets: storedStakingNomination.assets - assets,
      chainId,
    };
    context.StakingNomination.set(stakingNomination);
  }
});
