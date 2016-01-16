class AddAvailabilityStopToParkingSpaces < ActiveRecord::Migration
  def change
    add_column :parking_spaces, :availability_stop, :date
  end
end
