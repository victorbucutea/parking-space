class RemoveUnitIntervalFromParkingSpaces < ActiveRecord::Migration[5.1]
  def change
    remove_column :parking_spaces, :unit_interval, :string
  end
end
