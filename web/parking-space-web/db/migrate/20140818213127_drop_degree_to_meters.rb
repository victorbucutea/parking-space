class DropDegreeToMeters < ActiveRecord::Migration[5.1]
  def change
    drop_table :degree_to_meters
  end
end
