class CreateParkingSpaceSchedules < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :weekly_schedule, :string
    add_column :parking_spaces, :daily_start, :time
    add_column :parking_spaces, :daily_stop, :time
  end
end
