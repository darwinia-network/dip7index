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
  const cur: string = String(event.params.cur);
  const prev: string = String(event.params.prev);
  const votes = event.params.votes;
  const entity: CollatorStakingHub_AddCollator = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    cur,
    votes,
    prev,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };
  context.CollatorStakingHub_AddCollator.set(entity);

  const prevCollator = await context.CollatorSet.get(prev);
  const newCollator: CollatorSet = {
    id: cur,
    address: cur,
    seq: prevCollator ? (prevCollator.seq + 1) : 0,
    votes: votes,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };
  context.CollatorSet.set(newCollator);
});


CollatorStakingHub.RemoveCollator.handler(async ({event, context}) => {
  const cur: string = String(event.params.cur);
  const prev: string = String(event.params.prev);
  const entity: CollatorStakingHub_RemoveCollator = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    cur,
    prev,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };
  context.CollatorStakingHub_RemoveCollator.set(entity);

  context.CollatorSet.deleteUnsafe(cur);
});


CollatorStakingHub.UpdateCollator.handler(async ({event, context}) => {
  const cur: string = String(event.params.cur);
  const oldPrev: string = String(event.params.oldPrev);
  const newPrev: string = String(event.params.newPrev);
  const votes = event.params.votes;
  const entity: CollatorStakingHub_UpdateCollator = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    votes,
    cur,
    oldPrev,
    newPrev,
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
      seq: newPrevCollator.seq,
      votes: votes,
      blockNumber: BigInt(event.block.number),
      logIndex: event.logIndex,
      blockTimestamp: BigInt(event.block.timestamp),
    };
    context.CollatorSet.set(curCollator);
  }
});


// # ===== staking


CollatorStakingHub.CommissionUpdated.handler(async ({event, context}) => {
  const collator = String(event.params.collator);
  const entity: CollatorStakingHub_CommissionUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    collator,
    commission: event.params.commission,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };

  context.CollatorStakingHub_CommissionUpdated.set(entity);
});


CollatorStakingHub.Initialized.handler(async ({event, context}) => {
  const entity: CollatorStakingHub_Initialized = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    version: event.params.version,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };

  context.CollatorStakingHub_Initialized.set(entity);
});


CollatorStakingHub.NominationPoolCreated.handler(async ({event, context}) => {
  // const prev = event.params['prev'] ? String(event.params['prev']) : undefined;
  const prev = undefined;
  let seq = 0;
  if (prev) {
    const prevPool = await context.CollatorStakingHub_NominationPoolCreated.get(prev);
    seq = (prevPool?.seq ?? 0) + 1
  }

  const pool = String(event.params.pool);
  const collator = String(event.params.collator);

  const entity: CollatorStakingHub_NominationPoolCreated = {
    id: pool,
    pool,
    collator,
    prev,
    seq,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };

  context.CollatorStakingHub_NominationPoolCreated.set(entity);
});

CollatorStakingHub.Staked.handler(async ({event, context}) => {
  const pool = String(event.params.pool);
  const collator = String(event.params.collator);
  const account = String(event.params.account);
  const assets = event.params.assets;

  const entity: CollatorStakingHub_Staked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pool,
    collator,
    account,
    assets,
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
  };
  const stakingCollator: StakingCollator = {
    id: _stakingCollatorId,
    pool,
    collator,
    assets: (storedStakingCollator?.assets ?? 0n) + assets,
  };
  const stakingNomination: StakingNomination = {
    id: _stakingNominationId,
    pool,
    assets: (storedStakingNomination?.assets ?? 0n) + assets,
  };
  context.StakingAccount.set(stakingAccount);
  context.StakingCollator.set(stakingCollator);
  context.StakingNomination.set(stakingNomination);
});

CollatorStakingHub.Unstaked.handler(async ({event, context}) => {
  const pool = String(event.params.pool);
  const collator = String(event.params.collator);
  const account = String(event.params.account);
  const assets = event.params.assets;

  const entity: CollatorStakingHub_Unstaked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pool,
    collator,
    account,
    assets,
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
    };
    context.StakingAccount.set(stakingAccount);
  }
  if (storedStakingCollator) {
    const stakingCollator: StakingCollator = {
      id: _stakingCollatorId,
      pool,
      collator,
      assets: storedStakingCollator.assets - assets,
    };
    context.StakingCollator.set(stakingCollator);
  }
  if (storedStakingNomination) {
    const stakingNomination: StakingNomination = {
      id: _stakingNominationId,
      pool,
      assets: storedStakingNomination.assets - assets,
    };
    context.StakingNomination.set(stakingNomination);
  }
});
