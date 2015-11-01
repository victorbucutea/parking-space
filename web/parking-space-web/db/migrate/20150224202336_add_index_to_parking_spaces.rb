class AddIndexToParkingSpaces < ActiveRecord::Migration
  def up
    add_index(:parking_spaces, :location_lat)
    add_index(:parking_spaces, :location_long)
    add_index(:parking_spaces, :created_at)
    add_index(:parking_spaces, :interval)
  end
end
