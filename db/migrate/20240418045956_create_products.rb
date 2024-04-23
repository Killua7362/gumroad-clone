class CreateProducts < ActiveRecord::Migration[7.1]
  def change
    create_table :products do |t|
      t.text :title
      t.text :description
      t.text :summary
      t.integer :price
      t.belongs_to :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
