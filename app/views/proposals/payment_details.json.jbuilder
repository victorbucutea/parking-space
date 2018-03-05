json.array! @payment_details do |payment|
  json.extract! payment,  :kind,:name,:tax_amount, :total_amount,:unit_amount, :description
end
