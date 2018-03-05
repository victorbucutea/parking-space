class CreateAccounts < ActiveRecord::Migration[5.1]
  def change
    create_table :accounts do |t|
      t.decimal :amount
      t.string :currency
      t.belongs_to :user
      t.timestamps
    end
  end
end
