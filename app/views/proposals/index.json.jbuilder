json.array!(@proposals) do |prop|
  json.extract! prop, :id, :title_message, :bid_amount, :bid_currency, :bidder_name, :approval_status
end
