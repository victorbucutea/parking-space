class CreateParkingSpaceDocuments < ActiveRecord::Migration[5.2]
  def change
    create_table :documents do |t|
      t.string :file
      t.string :comment
      t.integer :status
      t.timestamps
    end
  end
end
