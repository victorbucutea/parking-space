class DropDegreeToMeters < ActiveRecord::Migration
  def change
    drop_table :degree_to_meters
  end
end
