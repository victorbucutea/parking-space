json.extract! parking_space, :id, :location_lat, :location_long, :title,
              :address_line_1, :address_line_2, :description, :recorded_from_lat,
              :recorded_from_long, :space_availability_start , :space_availability_stop,
              :owner_name, :updated_at, :created_at, :thumbnail_image_url, :standard_image_url

json.rotation_angle parking_space.rotation_angle.to_f
json.timestamp parking_space.created_at
json.public parking_space.public_parking?
json.price parking_space.target_price.to_f
json.thumbnail_url parking_space.thumbnail_image_url
json.image_url parking_space.standard_image_url
json.currency parking_space.target_price_currency
json.owner_is_current_user parking_space.deviceid == current_user.device_id
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
    json.pending proposal.pending?
    json.bid_price proposal.bid_amount.to_f
    json.bid_currency proposal.bid_currency
    json.start_date proposal.start_date
    json.end_date proposal.end_date
    json.owner_is_current_user proposal.deviceid == current_user.device_id
    json.read proposal.read
    json.owner_name proposal.bidder_name
  end
end
