class ChangeCollabsColumn < ActiveRecord::Migration[7.1]
  def change
    remove_column :products, :collabs
    add_column :products, :collabs, :jsonb, default: []
  end
end
