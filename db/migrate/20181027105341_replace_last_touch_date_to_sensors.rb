class ReplaceLastTouchDateToSensors < ActiveRecord::Migration[5.1]
  def change
    change_column :sensors, :last_touch_date, :datetime
  end
end
