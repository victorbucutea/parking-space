class AddValue3Value4ToParamaterValues < ActiveRecord::Migration[5.1]
  def change
    add_column :parameter_values, :value3, :string
    add_column :parameter_values, :value4, :string
  end
end
