class AddDeviceIdIndex < ActiveRecord::Migration
  def change
    add_index(:parking_spaces, :deviceid)
    add_index(:proposals, :deviceid)
  end
end
