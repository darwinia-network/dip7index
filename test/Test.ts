import assert from "assert";
import { 
  TestHelpers,
  CollatorStakingHub_AddCollator
} from "generated";
const { MockDb, CollatorStakingHub } = TestHelpers;

describe("CollatorStakingHub contract AddCollator event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for CollatorStakingHub contract AddCollator event
  const event = CollatorStakingHub.AddCollator.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("CollatorStakingHub_AddCollator is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await CollatorStakingHub.AddCollator.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualCollatorStakingHubAddCollator = mockDbUpdated.entities.CollatorStakingHub_AddCollator.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedCollatorStakingHubAddCollator: CollatorStakingHub_AddCollator = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      cur: event.params.cur,
      votes: event.params.votes,
      prev: event.params.prev,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualCollatorStakingHubAddCollator, expectedCollatorStakingHubAddCollator, "Actual CollatorStakingHubAddCollator should be the same as the expectedCollatorStakingHubAddCollator");
  });
});
