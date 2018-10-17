class RenameFkToSensorLocation < ActiveRecord::Migration[5.1]
  def change
      rename_column :sensors, :sensor_locations_id, :sensor_location_id
  end
end
