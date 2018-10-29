class RenameTypeInParkingPerimeters < ActiveRecord::Migration[5.1]
  def change
      rename_column :parking_perimeters, :type, :perimeter_type
  end
end
