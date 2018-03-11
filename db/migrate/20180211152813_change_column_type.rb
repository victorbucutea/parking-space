class ChangeColumnType < ActiveRecord::Migration[5.1]
  def change
    remove_column :parking_spaces, :approved_proposal_id
    change_column :proposals, :bid_amount, :decimal
  end
end
