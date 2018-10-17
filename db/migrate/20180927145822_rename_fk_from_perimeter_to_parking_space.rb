class RenameFkFromPerimeterToParkingSpace < ActiveRecord::Migration[5.1]
  def change
    rename_column :parking_perimeters, :parking_spaces_id, :parking_space_id
  end
end
