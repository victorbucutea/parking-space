class DeleteAvailabilityFromParkingSpace < ActiveRecord::Migration[5.1]
  def change
    remove_column :parking_spaces, :availability_start
    remove_column :parking_spaces, :availability_stop
  end
end
