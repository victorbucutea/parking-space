class CreateParkingSpaces < ActiveRecord::Migration
  def change
    create_table :parking_spaces do |t|
      t.decimal :location_lat
      t.decimal :location_long
      t.decimal :recorded_from_lat, :null => true
      t.decimal :recorded_from_long, :null => true
      t.string :deviceid

      t.timestamps
    end
  end
end
