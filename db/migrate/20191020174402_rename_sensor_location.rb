class RenameSensorLocation < ActiveRecord::Migration[5.2]
  def change
    rename_table :sensor_locations, :locations
  end
end
