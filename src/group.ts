import {
  ExpenseAdded,
  ExpenseReversed,
  ExpenseAdjusted,
  Payment,
  JoinApproved
} from "../generated/templates/Group/Group"
import {
  Expense,
  ExpenseReversal,
  ExpenseAdjustment,
  PaymentRecord,
  Membership
} from "../generated/schema"

/**
 * Handles ExpenseAdded event
 */
export function handleExpenseAdded(event: ExpenseAdded): void {
  const id = event.address.toHex() + "-" + event.params.id.toString()
  const exp = new Expense(id)

  exp.group     = event.address.toHex()
  exp.payer     = event.params.payer
  exp.description = event.params.desc
  exp.amount    = event.params.amount
  exp.createdAt = event.block.timestamp

  exp.save()
}

/**
 * Handles ExpenseReversed event
 */
export function handleExpenseReversed(event: ExpenseReversed): void {
  const reversalId = event.address.toHex() + "-" + event.params.reversalId.toString()
  const origId     = event.address.toHex() + "-" + event.params.originalId.toString()
  const rev = new ExpenseReversal(reversalId)

  rev.group      = event.address.toHex()
  rev.originalExpense = origId
  rev.reversalExpense = reversalId
  rev.createdAt  = event.block.timestamp

  rev.save()
}

/**
 * Handles ExpenseAdjusted event
 */
export function handleExpenseAdjusted(event: ExpenseAdjusted): void {
  const adjId = [
    event.address.toHex(),
    event.params.originalId.toString(),
    event.params.reversalId.toString(),
    event.params.newId.toString()
  ].join("-")
  const adj = new ExpenseAdjustment(adjId)

  adj.group           = event.address.toHex()
  adj.originalExpense = event.address.toHex() + "-" + event.params.originalId.toString()
  adj.reversalExpense = event.address.toHex() + "-" + event.params.reversalId.toString()
  adj.newExpense      = event.address.toHex() + "-" + event.params.newId.toString()
  adj.createdAt       = event.block.timestamp

  adj.save()
}

/**
 * Handles Payment event
 */
export function handlePayment(event: Payment): void {
  const id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  const rec = new PaymentRecord(id)

  rec.group     = event.address.toHex()
  rec.debtor    = event.params.debtor
  rec.creditor  = event.params.creditor
  rec.amount    = event.params.amount
  rec.createdAt = event.block.timestamp

  rec.save()
}

/**
 * Handles JoinApproved event
 */
export function handleJoinApproved(event: JoinApproved): void {
  const id = event.address.toHex() + "-" + event.params.applicant.toHex()
  const mem = new Membership(id)

  mem.group    = event.address.toHex()
  mem.user     = event.params.applicant
  mem.joinedAt = event.block.timestamp

  mem.save()
}