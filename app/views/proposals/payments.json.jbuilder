json.array! @payments do |transaction|
  json.extract! transaction, :id, :status,:currency_iso_code,:amount, :order_id,:created_at
  json.credit_card do
    json.extract! transaction.credit_card_details, :last_4, :card_type,:image_url
  end
end
