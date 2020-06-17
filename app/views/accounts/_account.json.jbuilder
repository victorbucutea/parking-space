unless account.nil?
  json.extract! account, :id, :currency, :iban, :created_at, :updated_at
  json.amount account.amount.to_f
  json.amount_pending account.amount_pending(current_user).to_f
end