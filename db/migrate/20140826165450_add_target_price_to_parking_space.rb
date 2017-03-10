class AddTargetPriceToParkingSpace < ActiveRecord::Migration
  def change
    add_column :parking_spaces, :target_price, :decimal
  end
end
