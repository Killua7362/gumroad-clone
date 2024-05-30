class AddCurrancyToProducts < ActiveRecord::Migration[7.1]
  def change
    add_column :products, :currency_code, :integer, array: true, null: false, default: []
  end
end
