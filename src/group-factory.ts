import { GroupCreated as GroupCreatedEvent } from "../generated/GroupFactory/GroupFactory"
import { GroupCreated } from "../generated/schema"

export function handleGroupCreated(event: GroupCreatedEvent): void {
  let entity = new GroupCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.group = event.params.group
  entity.name = event.params.name
  entity.creator = event.params.creator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
