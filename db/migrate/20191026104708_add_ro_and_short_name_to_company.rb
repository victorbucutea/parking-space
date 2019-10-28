class AddRoAndShortNameToCompany < ActiveRecord::Migration[5.2]
  def change
    add_column :companies, :registry, :string
    add_column :companies, :short_name, :string
  end
end
