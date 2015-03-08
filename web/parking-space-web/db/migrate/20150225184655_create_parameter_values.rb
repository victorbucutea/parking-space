class CreateParameterValues < ActiveRecord::Migration
  def change
    create_table :parameter_values do |t|
      t.string :key, index: true
      t.string :value
      t.references :parameter, index: true

      t.timestamps
    end
  end
end
