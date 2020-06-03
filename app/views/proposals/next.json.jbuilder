prop = @proposals[0]
json.extract! prop, :id, :title_message, :payment_date, :start_date, :end_date,
              :parking_space_id, :phone_number, :created_at
json.approved prop.approved?
json.rejected prop.rejected?
json.canceled prop.canceled?
json.paid prop.paid?
json.status prop.approval_status
json.pending prop.pending?
json.price prop.bid_amount.to_f
json.currency prop.bid_currency
json.owner_is_current_user prop.user.id == current_user.id
if prop.paid?
  json.amount prop.payment_amount.to_f
  json.comision prop.payment_comision.to_f
else
  json.amount prop.amount.to_f
  json.amount_with_vat prop.amount_with_vat.to_f
  json.comision prop.comision.to_f
  json.comision_with_vat prop.comision_with_vat.to_f
end
json.owner_name prop.user.full_name
json.owner_license prop.user.license
json.owner_phone_number prop.user.phone_number
json.owner_prefix prop.user.prefix
json.paid prop.paid?
json.active prop.active?
json.lat prop.parking_space.location_lat
json.lng prop.parking_space.location_long