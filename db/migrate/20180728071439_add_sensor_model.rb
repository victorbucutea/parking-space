class AddSensorModel < ActiveRecord::Migration[5.1]
  def change

    create_table :roles do |t|
      t.string :identifier
      t.integer :users_id
    end


    create_table :sensor_locations do |t|
      t.decimal :location_lat
      t.decimal :location_long
      t.string :parking_space_name
      t.string :address
      t.string :deviceid
      t.timestamps
    end

    create_table :sensors do |t|
      t.string :deviceid
      t.string :title_message
      t.string :snapshot
      t.string :location_text
      t.datetime :installation_date
      t.integer :sensor_locations_id

      t.timestamps
    end

    create_table :parking_perimeters do |t|
      t.decimal :top_left_x
      t.decimal :top_left_y
      t.decimal :bottom_right_x
      t.decimal :bottom_right_y
      t.string :identifier
      t.string :snapshot
      t.integer :sensors_id

    end



    add_reference :roles, :users, index: true
    add_foreign_key :roles, :users

    add_reference :parking_perimeters, :parking_spaces, index: true
    add_foreign_key :parking_perimeters, :parking_spaces


    add_reference :sensors, :sensor_locations, index: true
    add_foreign_key :sensors, :sensor_locations
  end
end
