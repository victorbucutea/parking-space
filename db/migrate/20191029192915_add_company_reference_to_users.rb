class AddCompanyReferenceToUsers < ActiveRecord::Migration[5.2]
  def change

    add_reference :users, :company, {index: true }
    add_foreign_key :users, :companies
  end
end
