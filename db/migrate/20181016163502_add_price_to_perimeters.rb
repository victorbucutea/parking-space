class AddPriceToPerimeters < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_perimeters, :price, :decimal
  end
end
