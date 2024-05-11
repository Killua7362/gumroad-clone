class AddCollabsToProducts < ActiveRecord::Migration[7.1]
  def change
    add_column :products, :collabs, :jsonb, array: true, default: []
  end
end
