class AddReviewAvgToParkingSpaces < ActiveRecord::Migration[5.2]
  def change
    add_column :parking_spaces, :review_avg, :decimal
  end
end
