class AddNameToImages < ActiveRecord::Migration[5.2]
  def change
    add_column :images, :name, :string
  end
end
