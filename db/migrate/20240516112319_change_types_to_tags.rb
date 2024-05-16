class ChangeTypesToTags < ActiveRecord::Migration[7.1]
  def change
    remove_column :products, :type
    add_column :products, :tags, :string, default: ''
  end
end
