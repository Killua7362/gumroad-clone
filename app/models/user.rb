class User < ApplicationRecord
  has_secure_password
  has_many :products

  validates :name, presence: true
  validates :email, uniqueness: true, presence: true
end
