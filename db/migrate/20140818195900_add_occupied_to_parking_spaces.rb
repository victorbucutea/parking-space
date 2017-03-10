class AddOccupiedToParkingSpaces < ActiveRecord::Migration
  def change
    add_column :parking_spaces, :occupied, :boolean
  end
end
