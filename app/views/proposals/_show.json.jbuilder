json.extract! proposal, :id, :title_message, :phone_number, :created_at, :parking_space_id
json.approved proposal.approved?
json.rejected proposal.rejected?
json.canceled proposal.canceled?
json.pending proposal.pending?
json.bid_price proposal.bid_amount.to_f
json.bid_currency proposal.bid_currency
json.start_date proposal.start_date
json.end_date proposal.end_date
json.owner_is_current_user proposal.user_id == current_user.device_id
json.read proposal.read
json.paid proposal.paid?
json.payment_date proposal.payment_date
json.amount proposal.amount.to_f
json.amount_with_vat proposal.amount_with_vat.to_f
json.comision proposal.comision.to_f
json.comision_with_vat proposal.comision_with_vat.to_f
json.owner_name proposal.bidder_name
json.parking_space_id proposal.parking_space_id