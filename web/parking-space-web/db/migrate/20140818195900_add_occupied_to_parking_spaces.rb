class AddOccupiedToParkingSpaces < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :occupied, :boolean
  end
end
