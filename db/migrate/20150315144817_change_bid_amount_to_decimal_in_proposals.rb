class ChangeBidAmountToDecimalInProposals < ActiveRecord::Migration
  def change
    change_column :proposals, :bid_amount, :numeric
  end
end
