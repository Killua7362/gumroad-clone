class CreateCollabs < ActiveRecord::Migration[7.1]
  def change
    create_table :collabs do |t|
      t.string :email
      t.integer :share
      t.boolean :approved
      t.belongs_to :product, null: false, foreign_key: true

      t.timestamps
    end
  end
end
