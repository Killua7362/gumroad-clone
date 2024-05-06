class Collab < ApplicationRecord
  belongs_to :product

  validates :email, uniqueness: {scope: :product_id}, presence: true
  validates :share, presence: true


  class << self
    def can_go_live(product_id)
      product = self.where(product_id: product_id).pluck(:approved)
      product.any?(false)
    end
  end

end
