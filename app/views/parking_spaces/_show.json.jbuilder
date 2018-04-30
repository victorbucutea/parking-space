json.extract! parking_space, :id, :location_lat, :location_long, :title,
              :address_line_1, :address_line_2, :description, :recorded_from_lat,
              :recorded_from_long, :space_availability_start, :space_availability_stop,
              :daily_start, :daily_stop, :weekly_schedule,
              :owner_name, :updated_at, :created_at, :file1, :file2, :file3

json.timestamp parking_space.created_at
json.public parking_space.public_parking?
json.price parking_space.target_price.to_f
json.currency parking_space.target_price_currency
json.owner_is_current_user parking_space.user.id == current_user.id
json.expired parking_space.expired?
if parking_space.owner.present?
  json.owner_phone_number parking_space.owner.phone_number
  json.owner_email parking_space.owner.email
end

json.offers do
  # this call increases costs by 40%, replacing the partial call with its raw content
  # json.array! parking_space.proposals, partial: 'proposals/show', as: :proposal
  json.array! parking_space.proposals do |proposal|
    json.extract! proposal, :id, :title_message, :phone_number, :created_at
    json.approved proposal.approved?
    json.rejected proposal.rejected?
    json.canceled proposal.canceled?
    json.status proposal.approval_status
    json.pending proposal.pending?
    json.bid_price proposal.bid_amount.to_f
    json.bid_currency proposal.bid_currency
    json.start_date proposal.start_date
    json.end_date proposal.end_date
    json.owner_is_current_user proposal.user.id == current_user.id
    json.read proposal.read
    json.amount proposal.amount.to_f
    json.amount_with_vat proposal.amount_with_vat.to_f
    json.comision proposal.comision.to_f
    json.comision_with_vat proposal.comision_with_vat.to_f
    json.owner_name proposal.bidder_name
    json.paid proposal.paid?
    json.payment_date proposal.payment_date
  end
end
