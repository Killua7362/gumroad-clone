class Product < ApplicationRecord
  belongs_to :user

  has_many :reviews
  has_many :collabs
end
