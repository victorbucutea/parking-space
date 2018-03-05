class ChangePaymentDateToDateTime < ActiveRecord::Migration[5.1]
  def change
    change_column :proposals, :payment_date, :datetime
  end
end
