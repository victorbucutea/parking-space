class CreateSections < ActiveRecord::Migration[5.2]
  def change
    create_table :sections do |t|
      t.string :name
      t.text :description
      t.string :map_polygon
      t.text :interior_map

      t.timestamps
    end

    add_reference :sections, :location, index: true
    add_foreign_key :sections, :locations

    # add_reference :sensors, :sensor_location, index: true
    # add_foreign_key :sensors, :sensor_locations
    remove_reference :sensors, :sensor_location
    # remove_foreign_key :sensors, :sensor_location

    add_reference :sensors, :section, index: true
    add_foreign_key :sensors, :sections
  end
end
