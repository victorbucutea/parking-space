class AddTargetPriceCurrencyToParkingSpace < ActiveRecord::Migration
  def change
    add_column :parking_spaces, :target_price_currency, :text
  end
end
