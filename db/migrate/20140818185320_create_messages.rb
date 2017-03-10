class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.string :deviceid
      t.string :content
      t.integer :proposal_id

      t.timestamps
    end
  end
end
