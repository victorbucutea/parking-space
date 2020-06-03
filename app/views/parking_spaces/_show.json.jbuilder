json.extract! parking_space, :id, :location_lat, :location_long, :title,
              :address_line_1, :address_line_2, :description, :space_availability_start, :space_availability_stop,
              :daily_start, :daily_stop, :weekly_schedule, :updated_at, :created_at

json.timestamp parking_space.created_at
json.price parking_space.target_price.to_f
json.currency parking_space.target_price_currency
json.owner_is_current_user parking_space.user.id == current_user.id unless parking_space.user.nil?
json.owner_name parking_space.user.full_name
json.expired parking_space.expired?
json.from_sensor parking_space.sensor_source?
json.from_user parking_space.user_source?
json.from_company parking_space.company_source?
json.missing_title_deed parking_space.missing_title_deed?
json.validation_pending parking_space.validation_pending?
json.validated parking_space.validated?
json.owner_prefix parking_space.user.prefix
json.owner_phone_number parking_space.user.phone_number
json.owner_email parking_space.user.email
json.review_avg parking_space.review_avg
json.review_count parking_space.review_count

json.images do
  json.array! parking_space.images do |img|
    json.image img.image
    json.id img.id
    json.name img.image
    json.created_at img.created_at
    json.updated_at img.updated_at
  end
end
#
# json.offers do
#   json.array! parking_space.approved_proposals do |proposal|
#     json.extract! proposal, :id, :title_message, :phone_number, :created_at
#     json.approved proposal.approved?
#     json.rejected proposal.rejected?
#     json.canceled proposal.canceled?
#     json.paid proposal.paid?
#     json.status proposal.approval_status
#     json.pending proposal.pending?
#     json.price proposal.bid_amount.to_f
#     json.currency proposal.bid_currency
#     json.start_date proposal.start_date
#     json.end_date proposal.end_date
#     json.owner_is_current_user proposal.user.id == current_user.id
#     json.amount proposal.amount.to_f
#     json.amount_with_vat proposal.amount_with_vat.to_f
#     json.comision proposal.comision.to_f
#     json.comision_with_vat proposal.comision_with_vat.to_f
#     json.owner_name proposal.user.full_name
#     json.owner_license proposal.user.license
#     json.owner_phone_number proposal.user.phone_number
#     json.owner_prefix proposal.user.prefix
#     json.paid proposal.paid?
#     json.active proposal.active?
#     json.payment_date proposal.payment_date
#   end
# end

# unless parking_space.parking_perimeter.nil?
#   json.perimeter do
#     json.extract! parking_space.parking_perimeter, :id, :rules_expression, :description
#     json.section do
#       json.extract! parking_space.parking_perimeter.section, :id, :name, :description, :interior_map
#     end
#   end
# end
