class CreateProfiles < ActiveRecord::Migration[7.1]
  def change
    create_table :profiles do |t|
      t.string :name
      t.string :bio
      t.jsonb :category, default: []
      t.belongs_to :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
