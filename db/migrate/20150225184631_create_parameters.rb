class CreateParameters < ActiveRecord::Migration[5.1]
  def change
    create_table :parameters do |t|
      t.string :name
      t.string :default_value
      t.timestamps
    end
  end
end
