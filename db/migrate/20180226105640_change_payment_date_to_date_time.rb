class ChangePaymentDateToDateTime < ActiveRecord::Migration[5.1]
  def change
    remove_column :proposals, :payment_date
    add_column :proposals, :payment_date, :datetime
  end
end
