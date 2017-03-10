class AddAvailabilityStartToParkingSpaces < ActiveRecord::Migration
  def change
    add_column :parking_spaces, :availability_start, :date
  end
end
