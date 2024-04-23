class AddTypeToProducts < ActiveRecord::Migration[7.1]
  def change
    add_column :products, :type, :string
    add_column :products, :live, :boolean
    add_column :products, :collab_active, :boolean
    add_column :products, :thumbimageSource, :string
    add_column :products, :coverimageSource, :string
  end
end
