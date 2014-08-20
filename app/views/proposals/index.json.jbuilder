json.array!(@proposals) do |prop|
  json.extract! prop, :id, :deviceid, :title_message, :bid_amount, :bid_currency, :win_flag
end
