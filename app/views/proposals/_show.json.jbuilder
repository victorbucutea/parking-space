json.extract! proposal, :id, :phone_number, :created_at
json.approved proposal.approved?
json.rejected proposal.rejected?
json.canceled proposal.canceled?
json.paid proposal.paid?
json.status proposal.approval_status
json.pending proposal.pending?
json.price proposal.bid_amount.to_f
json.currency proposal.bid_currency
json.start_date proposal.start_date
json.end_date proposal.end_date
json.owner_is_current_user proposal.user.id == current_user.id
if proposal.paid?
  json.amount proposal.payment_amount.to_f
  json.comision proposal.payment_comision.to_f
else
  json.amount proposal.amount.to_f
  json.amount_with_vat proposal.amount_with_vat.to_f
  json.comision proposal.comision.to_f
  json.comision_with_vat proposal.comision_with_vat.to_f
end
json.owner_name proposal.user.full_name
json.owner_license proposal.user.license
json.owner_phone_number proposal.user.phone_number
json.owner_prefix proposal.user.prefix
json.paid proposal.paid?
json.active proposal.active?
json.payment_date proposal.payment_date