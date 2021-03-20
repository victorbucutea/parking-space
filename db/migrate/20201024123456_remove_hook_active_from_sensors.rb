class RemoveHookActiveFromSensors < ActiveRecord::Migration[5.2]
  def change
    remove_column :sensors, :hook_active
    remove_column :sensors, :console_hit_count
  end
end
