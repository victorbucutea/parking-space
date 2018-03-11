json.array! @withdrawals do |withd|
  json.extract! withd, :id, :amount, :iban, :status, :created_at
end
