json.extract! @withdrawal, :id, :amount, :iban, :status, :created_at
json.pending @withdrawal.pending?
json.rejected @withdrawal.rejected?
json.canceled @withdrawal.canceled?
json.executed @withdrawal.executed?
