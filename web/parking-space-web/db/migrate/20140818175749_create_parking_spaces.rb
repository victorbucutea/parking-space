class CreateParkingSpaces < ActiveRecord::Migration
  def change
    create_table :parking_spaces do |t|
      t.decimal :location_lat
      t.decimal :location_long
      t.decimal :recorded_from_lat
      t.decimal :recorded_from_long
      t.string :deviceid

      t.timestamps
    end
  end
end
