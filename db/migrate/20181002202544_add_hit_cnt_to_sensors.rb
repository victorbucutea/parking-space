class AddHitCntToSensors < ActiveRecord::Migration[5.1]
  def change
    add_column :sensors, :hit_count, :integer
  end
end
