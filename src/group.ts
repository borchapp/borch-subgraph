import { ExpenseAdded, ExpenseReversed, ExpenseAdjusted, Payment, JoinApproved } from "../generated/templates/Group/Group";
import { Expense, ExpenseReversal, ExpenseAdjustment, PaymentRecord, Membership } from "../generated/schema";

/**
 * Handles ExpenseAdded event: records a new expense.
 */
export function handleExpenseAdded(event: ExpenseAdded): void {
  // Unique ID: contract address + expense ID
  const id = event.address.toHex() + "-" + event.params.id.toString();
  const exp = new Expense(id);

  exp.group       = event.address;          // Group contract instance
  exp.payer       = event.params.payer;     // Transaction initiator
  exp.description = event.params.desc;      // Expense description
  exp.amount      = event.params.amount;    // Amount (micro-USDC)
  exp.timestamp   = event.block.timestamp;  // Block timestamp

  exp.save();  // Persist entity
}

/**
 * Handles ExpenseReversed event: logs reversal of an expense.
 */
export function handleExpenseReversed(event: ExpenseReversed): void {
  // IDs for original and reversal entries
  const reversalId = event.address.toHex() + "-" + event.params.reversalId.toString();
  const originalId = event.address.toHex() + "-" + event.params.originalId.toString();
  const rev = new ExpenseReversal(reversalId);

  rev.group           = event.address;        // Contract instance
  rev.originalExpense = originalId;           // ID of expense being reversed
  rev.reversalExpense = reversalId;           // This reversal record
  rev.timestamp       = event.block.timestamp;

  rev.save();  // Persist reversal
}

/**
 * Handles ExpenseAdjusted event: captures full adjust lifecycle.
 */
export function handleExpenseAdjusted(event: ExpenseAdjusted): void {
  // Combined ID for the adjustment event
  const adjId = [
    event.address.toHex(),
    event.params.originalId.toString(),
    event.params.reversalId.toString(),
    event.params.newId.toString()
  ].join("-");
  const adj = new ExpenseAdjustment(adjId);

  adj.group           = event.address;
  adj.originalExpense = event.address.toHex() + "-" + event.params.originalId.toString();
  adj.reversalExpense = event.address.toHex() + "-" + event.params.reversalId.toString();
  adj.newExpense      = event.address.toHex() + "-" + event.params.newId.toString();
  adj.timestamp       = event.block.timestamp;

  adj.save();  // Persist adjustment summary
}

/**
 * Handles Payment event: records debt settlement on-chain.
 */
export function handlePayment(event: Payment): void {
  // Unique ID: transaction hash + log index
  const id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  const rec = new PaymentRecord(id);

  rec.group     = event.address;         // Contract instance
  rec.debtor    = event.params.debtor;   // Payer of debt
  rec.creditor  = event.params.creditor; // Recipient of payment
  rec.amount    = event.params.amount;   // Amount settled
  rec.timestamp = event.block.timestamp; // Block timestamp

  rec.save();  // Persist payment record
}

/**
 * Handles JoinApproved event: logs when a user joins the group.
 */
export function handleJoinApproved(event: JoinApproved): void {
  // Unique ID: group address + applicant address
  const id = event.address.toHex() + "-" + event.params.applicant.toHex();
  const mem = new Membership(id);

  mem.group    = event.address;              // Contract instance
  mem.user     = event.params.applicant;     // New member
  mem.joinedAt = event.block.timestamp;      // Approval timestamp

  mem.save();  // Persist membership
}