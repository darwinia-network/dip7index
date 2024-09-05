import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AddCollator } from "../generated/schema"
import { AddCollator as AddCollatorEvent } from "../generated/CollatorStakingHub/CollatorStakingHub"
import { handleAddCollator } from "../src/collator-staking-hub"
import { createAddCollatorEvent } from "./collator-staking-hub-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let cur = Address.fromString("0x0000000000000000000000000000000000000001")
    let votes = BigInt.fromI32(234)
    let prev = Address.fromString("0x0000000000000000000000000000000000000001")
    let newAddCollatorEvent = createAddCollatorEvent(cur, votes, prev)
    handleAddCollator(newAddCollatorEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AddCollator created and stored", () => {
    assert.entityCount("AddCollator", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AddCollator",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "cur",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AddCollator",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "votes",
      "234"
    )
    assert.fieldEquals(
      "AddCollator",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "prev",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
