import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { GroupCreated } from "../generated/GroupFactory/GroupFactory"

export function createGroupCreatedEvent(
  group: Address,
  name: string,
  creator: Address
): GroupCreated {
  let groupCreatedEvent = changetype<GroupCreated>(newMockEvent())

  groupCreatedEvent.parameters = new Array()

  groupCreatedEvent.parameters.push(
    new ethereum.EventParam("group", ethereum.Value.fromAddress(group))
  )
  groupCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  groupCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return groupCreatedEvent
}
