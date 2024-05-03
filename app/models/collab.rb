class Collab < ApplicationRecord
  belongs_to :product

  validates :email, uniqueness: {scope: :product_id}, presence: true
  validates :share, presence: true
end
