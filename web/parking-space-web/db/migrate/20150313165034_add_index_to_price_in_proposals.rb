class AddIndexToPriceInProposals < ActiveRecord::Migration
  def change
    add_index(:proposals, :bid_amount)
  end
end
