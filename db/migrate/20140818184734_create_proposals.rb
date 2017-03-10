class CreateProposals < ActiveRecord::Migration
  def change
    create_table :proposals do |t|
      t.string :deviceid
      t.string :title_message
      t.integer :parking_space_id

      t.timestamps
    end
  end
end
