class AddValue7ToParameterValues < ActiveRecord::Migration[5.2]
  def change
    add_column :parameter_values, :value7, :string
  end
end
