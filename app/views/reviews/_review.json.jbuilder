json.extract! review, :id, :comment, :rating, :title, :parking_space_id,
              :user_id, :owner_name, :created_at, :updated_at
json.url review_url(review, format: :json)
