import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { GroupCreated } from "../generated/schema"
import { GroupCreated as GroupCreatedEvent } from "../generated/GroupFactory/GroupFactory"
import { handleGroupCreated } from "../src/group-factory"
import { createGroupCreatedEvent } from "./group-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let group = Address.fromString("0x0000000000000000000000000000000000000001")
    let name = "Example string value"
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newGroupCreatedEvent = createGroupCreatedEvent(group, name, creator)
    handleGroupCreated(newGroupCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("GroupCreated created and stored", () => {
    assert.entityCount("GroupCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GroupCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "group",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GroupCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "name",
      "Example string value"
    )
    assert.fieldEquals(
      "GroupCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
