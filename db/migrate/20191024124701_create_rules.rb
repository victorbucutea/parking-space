class CreateRules < ActiveRecord::Migration[5.2]
  def change
    create_table :rules do |t|
      t.text :description
      t.string :name
      t.decimal :start
      t.decimal :stop
      t.string :role
      t.timestamps
    end
  end
end
