class AddContentToProducts < ActiveRecord::Migration[7.1]
  def change
    add_column :products, :contents, :jsonb, default: [{ 'name': 'Default Page', 'content': '' }]
  end
end
