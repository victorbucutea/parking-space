class AddAvailabilityStartToParkingSpaces < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :availability_start, :date
  end
end
