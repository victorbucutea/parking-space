class RenameTypeToResourceType < ActiveRecord::Migration[5.2]
  def change
    rename_column :documents,:type,:resource_type
  end
end
