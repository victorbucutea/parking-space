class ChangeBidAmountToDecimalInProposals < ActiveRecord::Migration[5.1]
  def change
    change_column :proposals, :bid_amount, :decimal
  end
end
