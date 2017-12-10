class AddPaymentMethodToProposals < ActiveRecord::Migration[5.1]
  def change
    add_column :proposals, :payment_method, :string
    add_column :proposals, :payment_status, :integer
  end
end
