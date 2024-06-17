class AddFolderIdToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :folder_id, :string
  end
end
