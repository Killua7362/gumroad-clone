class AddInfoToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :name, :string
    add_column :users, :provider, :string, default: 'rails_login'
  end
end
