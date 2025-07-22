import {
  ExpenseAdded,
  ExpenseReversed,
  ExpenseAdjusted,
  Payment,
  JoinApproved
} from "../generated/templates/Group/Group";
import {
  Expense,
  ExpenseReversal,
  ExpenseAdjustment,
  PaymentRecord,
  Membership
} from "../generated/schema";

// --- ExpenseAdded handler ---
export function handleExpenseAdded(event: ExpenseAdded): void {
  let id = event.address.toHex() + "-" + event.params.id.toString();
  let exp = new Expense(id);

  exp.group       = event.address;
  exp.payer       = event.params.payer;
  exp.description = event.params.desc;
  exp.amount      = event.params.amount;
  exp.timestamp   = event.block.timestamp;
  exp.save();
}

// --- ExpenseReversed handler ---
export function handleExpenseReversed(event: ExpenseReversed): void {
  // reversalId ve originalId de aynı mapping ile yeni Expense kaydıdır
  let revId = event.address.toHex() + "-" + event.params.reversalId.toString();
  let origId = event.address.toHex() + "-" + event.params.originalId.toString();

  let rev = new ExpenseReversal(revId);
  rev.group            = event.address;
  rev.originalExpense  = origId;
  rev.reversalExpense  = revId;
  rev.timestamp        = event.block.timestamp;
  rev.save();
}

// --- ExpenseAdjusted handler ---
export function handleExpenseAdjusted(event: ExpenseAdjusted): void {
  // Tek bir ID atamak için üç ID’yi birleştiriyoruz
  let adjId = [
    event.address.toHex(),
    event.params.originalId.toString(),
    event.params.reversalId.toString(),
    event.params.newId.toString()
  ].join("-");

  let adj = new ExpenseAdjustment(adjId);
  adj.group            = event.address;
  adj.originalExpense  = event.address.toHex() + "-" + event.params.originalId.toString();
  adj.reversalExpense  = event.address.toHex() + "-" + event.params.reversalId.toString();
  adj.newExpense       = event.address.toHex() + "-" + event.params.newId.toString();
  adj.timestamp        = event.block.timestamp;
  adj.save();
}

// --- Payment handler ---
export function handlePayment(event: Payment): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let record = new PaymentRecord(id);

  record.group     = event.address;
  record.debtor    = event.params.debtor;
  record.creditor  = event.params.creditor;
  record.amount    = event.params.amount;
  record.timestamp = event.block.timestamp;
  record.save();
}

// --- JoinApproved handler ---
export function handleJoinApproved(event: JoinApproved): void {
  let id = event.address.toHex() + "-" + event.params.applicant.toHex();
  let membership = new Membership(id);

  membership.group    = event.address;
  membership.user     = event.params.applicant;
  membership.joinedAt = event.block.timestamp;
  membership.save();
}