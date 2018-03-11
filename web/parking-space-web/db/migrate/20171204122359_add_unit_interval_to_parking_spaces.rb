class AddUnitIntervalToParkingSpaces < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :unit_interval, :string
  end
end
