class AddCompanyRefToLocation < ActiveRecord::Migration[5.2]
  def change

    add_reference :locations, :company, {index: true }
    add_foreign_key :locations, :companies
  end
end
