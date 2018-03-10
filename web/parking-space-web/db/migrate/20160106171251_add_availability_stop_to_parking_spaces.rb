class AddAvailabilityStopToParkingSpaces < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :availability_stop, :date
  end
end
