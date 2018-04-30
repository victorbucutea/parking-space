class AddTargetPriceCurrencyToParkingSpace < ActiveRecord::Migration[5.1]
  def change
    add_column :parking_spaces, :target_price_currency, :text
  end
end
