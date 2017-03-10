class AddIndexToAvailabilityStartStop < ActiveRecord::Migration
  def change
    add_index(:parking_spaces, :space_availability_start)
    add_index(:parking_spaces, :space_availability_stop)
  end
end
