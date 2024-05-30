class ChangeCurrencyCode < ActiveRecord::Migration[7.1]
  def change
    remove_column :products, :currency_code
    add_column :products, :currency_code, :integer, default: 0
  end
end
