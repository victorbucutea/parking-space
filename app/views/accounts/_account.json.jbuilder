unless account.nil?
  json.extract! account, :id, :currency, :created_at, :updated_at
  json.amount account.amount.to_f
end