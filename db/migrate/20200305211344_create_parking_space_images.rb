class CreateParkingSpaceImages < ActiveRecord::Migration[5.2]
  def change
    create_table :parking_space_images do |t|
      t.string :image
      t.string :comment
      t.timestamps
    end

    add_reference :parking_space_images, :parking_space, index: true, foreign_key: true

  end
end
