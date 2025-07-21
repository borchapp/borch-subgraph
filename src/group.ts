import {
  ExpenseAdded,
  Payment,
  JoinApproved
} from "../generated/templates/Group/Group"
import { Expense, PaymentRecord, Membership } from "../generated/schema"

export function handleExpenseAdded(event: ExpenseAdded): void {
  let id = event.address.toHex() + "-" + event.params.id.toString()
  let expense = new Expense(id)

  expense.group = event.address
  expense.payer = event.params.payer
  expense.description = event.params.desc
  expense.amount = event.params.amount
  expense.timestamp = event.block.timestamp

  expense.save()
}

export function handlePayment(event: Payment): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let record = new PaymentRecord(id)

  record.group = event.address
  record.debtor = event.params.debtor
  record.creditor = event.params.creditor
  record.amount = event.params.amount
  record.timestamp = event.block.timestamp

  record.save()
}

export function handleJoinApproved(event: JoinApproved): void {
  let id = event.address.toHex() + "-" + event.params.applicant.toHex()
  let membership = new Membership(id)

  membership.group = event.address
  membership.user = event.params.applicant
  membership.joinedAt = event.block.timestamp

  membership.save()
}