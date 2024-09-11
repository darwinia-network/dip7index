/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */

import {
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
} from "generated";

import * as store from './IndexStore'


// # ===== collators

CollatorStakingHub.AddCollator.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const cur = event.params.cur.toLowerCase();
  const prev = event.params.prev.toLowerCase();
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

  await store.addCollator(context, entity);
});


CollatorStakingHub.RemoveCollator.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const cur = event.params.cur.toLowerCase();
  const entity: CollatorStakingHub_RemoveCollator = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    cur,
    prev: event.params.prev.toLowerCase(),
    chainId,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };
  context.CollatorStakingHub_RemoveCollator.set(entity);

  await store.removeCollator(context, entity);
});


CollatorStakingHub.UpdateCollator.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const cur = event.params.cur.toLowerCase();
  const oldPrev = event.params.oldPrev.toLowerCase();
  const newPrev = event.params.newPrev.toLowerCase();
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

  await store.updateCollator(context, entity);
});

CollatorStakingHub.RewardDistributed.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const collator = event.params.collator.toLowerCase();
  const reward = event.params.reward;
  const entity: CollatorStakingHub_RewardDistributed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    collator,
    reward,
    chainId,
    blockNumber: BigInt(event.block.number),
    logIndex: event.logIndex,
    blockTimestamp: BigInt(event.block.timestamp),
  };
  context.CollatorStakingHub_RewardDistributed.set(entity);

  await store.rewardDistributed(context, entity);
});

// # ===== staking


CollatorStakingHub.CommissionUpdated.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const collator = event.params.collator.toLowerCase();
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

  await store.commissionUpdated(context, entity);
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
  const pool = event.params.pool.toLowerCase();
  const collator = event.params.collator.toLowerCase();
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

  await store.nominationPoolCreated(context, entity);
});

CollatorStakingHub.Staked.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const pool = event.params.pool.toLowerCase();
  const collator = event.params.collator.toLowerCase();
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

  await store.staked(context, entity);
});

CollatorStakingHub.Unstaked.handler(async ({event, context}) => {
  const chainId = BigInt(event.chainId);
  const pool = event.params.pool.toLowerCase();
  const collator = event.params.collator.toLowerCase();
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

  await store.unstaked(context, entity);
});
