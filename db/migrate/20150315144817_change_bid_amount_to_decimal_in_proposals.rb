class ChangeBidAmountToDecimalInProposals < ActiveRecord::Migration
  def change
    change_column :proposals, :bid_amount, :fl
  end
end
