class AddOfferingStartStopToParkingSpaces < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :space_availability_start, :datetime
    add_column :parking_spaces, :space_availability_stop, :datetime
  end
end
