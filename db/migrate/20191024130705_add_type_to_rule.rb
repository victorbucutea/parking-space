class AddTypeToRule < ActiveRecord::Migration[5.2]
  def change
    add_column :rules, :type, :string
  end
end
