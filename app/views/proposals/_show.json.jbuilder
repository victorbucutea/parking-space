json.extract! proposal, :id, :title_message, :phone_number, :created_at, :parking_space_id
json.approved proposal.approved?
json.rejected proposal.rejected?
json.pending proposal.pending?
json.bid_price proposal.bid_amount.to_f
json.bid_currency proposal.bid_currency
json.start_date proposal.start_date
json.end_date proposal.end_date
json.owner_is_current_user proposal.deviceid == current_user.device_id
json.read proposal.read
json.owner_name proposal.bidder_name