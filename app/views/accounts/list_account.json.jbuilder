json.partial! "accounts/account", account: @account
json.withdrawals do
  json.array! @withdrawals do |withd|
    json.extract! withd, :id, :amount, :iban, :status, :created_at
    json.pending withd.pending?
    json.rejected withd.rejected?
    json.canceled withd.canceled?
    json.executed withd.executed?
  end
end