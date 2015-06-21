json.extract! parking_space, :id, :location_lat, :location_long, :title,
              :address_line_1, :address_line_2, :description, :recorded_from_lat,
              :recorded_from_long, :phone_number,
              :owner_name, :updated_at, :created_at, :thumbnail_image_url, :standard_image_url

json.rotation_angle parking_space.rotation_angle.to_f
json.timestamp parking_space.created_at
json.short_term parking_space.short_term?
json.price parking_space.target_price.to_f
json.currency parking_space.target_price_currency
json.owner_is_current_user parking_space.deviceid == current_user.device_id
json.expired parking_space.expired?
json.image image_tag 'Romania.png'

json.offers do
  # this call increases costs by 40%, replacing the partial call it with its raw content
  # json.array! parking_space.proposals, partial: 'proposals/show', as: :proposal
  json.array! parking_space.proposals do |proposal|
    json.extract! proposal, :id, :title_message, :phone_number, :created_at
    json.approved proposal.approved?
    json.rejected proposal.rejected?
    json.pending proposal.pending?
    json.price proposal.bid_amount.to_f
    json.currency proposal.bid_currency
    json.owner_is_current_user proposal.deviceid == current_user.device_id
    json.read proposal.read
    json.owner_name proposal.bidder_name
    json.messages do
      json.array! proposal.messages do |message|
        json.extract! message, :id, :proposal_id, :content, :created_at
        json.owner_is_current_user message.deviceid == current_user.device_id
      end
    end
  end
end