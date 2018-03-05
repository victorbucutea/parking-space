class ChangePaymentMethod < ActiveRecord::Migration[5.1]
  def change
    change_column :proposals, :payment_method, 'date USING cast(payment_method as date)' 
    rename_column :proposals, :payment_method, :payment_date
  end
end
