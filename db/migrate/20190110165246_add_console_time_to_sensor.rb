class AddConsoleTimeToSensor < ActiveRecord::Migration[5.2]
  def change
    add_column :sensors, :console_hit_count, :integer
  end
end
