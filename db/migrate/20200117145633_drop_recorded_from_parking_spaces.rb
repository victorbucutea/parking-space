class DropRecordedFromParkingSpaces < ActiveRecord::Migration[5.2]
  def change
    remove_column :parking_spaces, :recorded_from_lat
    remove_column :parking_spaces, :recorded_from_long
  end
end
