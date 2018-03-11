class AddBidAmountToProposals < ActiveRecord::Migration[5.1]
  def change
    add_column :proposals, :bid_amount, :integer
    add_column :proposals, :bid_currency, :string
  end
end
