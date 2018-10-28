class AddLastTouchDateToSensors < ActiveRecord::Migration[5.1]
  def change
    add_column :sensors, :last_touch_date, :date
  end
end
