json.extract! proposal, :id, :title_message, :phone_number, :created_at
json.approved proposal.approved?
json.rejected proposal.rejected?
json.pending proposal.pending?
json.price proposal.bid_amount.to_f
json.currency proposal.bid_currency
json.owner_is_current_user proposal.deviceid == session[:deviceid]
json.read proposal.read
json.owner_name proposal.bidder_name
json.messages do
  json.array! proposal.messages do |message|
    json.extract! message, :id, :proposal_id, :content, :created_at
    json.owner_is_current_user message.deviceid == session[:deviceid]
  end
end