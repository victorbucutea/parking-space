class AddPaymentIdToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :payment_id, :string
  end
end
