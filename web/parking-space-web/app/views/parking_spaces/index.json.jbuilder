
json.array!(@parking_spaces) do |parking_space|

  json.extract! parking_space, :id, :location_lat, :location_long, :title,
                :address_line_1, :address_line_2, :description, :recorded_from_lat,
                :recorded_from_long, :phone_number,
                :owner_name, :updated_at ,:created_at, :thumbnail_image_url, :standard_image_url, :rotation_angle

  json.timestamp parking_space.created_at
  json.short_term parking_space.short_term?
  json.price parking_space.target_price.to_f
  json.currency parking_space.target_price_currency
  json.owner_is_current_user parking_space.deviceid == session[:deviceid]


  json.offers do
    json.array! parking_space.proposals do |proposal|
      json.extract! proposal, :id,  :title_message, :phone_number, :approval_status, :created_at
      json.price proposal.bid_amount
      json.currency proposal.bid_currency
      json.owner_is_current_user proposal.deviceid == session[:deviceid]
      json.read proposal.read
      json.owner_name proposal.bidder_name
      json.messages do
        json.array! proposal.messages do |message|
          json.extract! message, :id, :proposal_id, :content, :created_at
          json.owner_is_current_user message.deviceid == session[:deviceid]
        end
      end
    end
  end
end
