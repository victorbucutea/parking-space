class ChangePaymentMethod < ActiveRecord::Migration[5.1]
  def change
    execute "UPDATE PROPOSALS set payment_method = null"
    change_column :proposals, :payment_method, :string
    rename_column :proposals, :payment_method, :payment_date
  end
end
