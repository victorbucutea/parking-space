class AddDescriptinToPerimeter < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_perimeters, :description, :string
  end
end
