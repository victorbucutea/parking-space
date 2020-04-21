class AddValuesToParameterValue < ActiveRecord::Migration[5.2]
  def change
    add_column :parameter_values, :value5, :string
    add_column :parameter_values, :value6, :string
  end
end
