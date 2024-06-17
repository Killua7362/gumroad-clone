class AddFolderIdToProducts < ActiveRecord::Migration[7.1]
  def change
    add_column :products, :folder_id, :string
  end
end
