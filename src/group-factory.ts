import { GroupCreated as GroupCreatedEvent } from "../generated/GroupFactory/GroupFactory"
import { Group } from "../generated/schema"

export function handleGroupCreated(event: GroupCreatedEvent): void {
  let id = event.params.group.toHex()
  let entity = new Group(id)

  entity.name            = event.params.name
  entity.creator         = event.params.creator
  entity.blockNumber     = event.block.number
  entity.createdAt       = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}