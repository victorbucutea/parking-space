class AddValue2Value3ToParameterValues < ActiveRecord::Migration[5.1]
  def change
    add_column :parameter_values, :value1, :string
    add_column :parameter_values, :value2, :string
  end
end
