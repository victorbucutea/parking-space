class CreateWithdrawals < ActiveRecord::Migration[5.1]
  def change
    create_table :withdrawals do |t|
      t.decimal :amount, index: true
      t.string :iban
      t.integer :status
      t.string :status_message
      t.datetime :processed_at
      t.belongs_to :account, foreign_key: true

      t.timestamps
    end
  end
end
