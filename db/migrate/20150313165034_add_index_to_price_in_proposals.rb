class AddIndexToPriceInProposals < ActiveRecord::Migration[5.1]
  def change
    add_index(:proposals, :bid_amount)
  end
end
