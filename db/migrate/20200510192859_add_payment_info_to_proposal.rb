class AddPaymentInfoToProposal < ActiveRecord::Migration[5.2]
  def change
    add_column :proposals, :payment_id, :string
    add_column :proposals, :payment_amount, :decimal
    add_column :proposals, :payment_comision, :decimal
    add_column :proposals, :payment_vat, :decimal
  end
end
