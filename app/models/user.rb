class User < ApplicationRecord
  has_secure_password
  has_many :products

  validates :name, presence: true
  validates :email, uniqueness: true, presence: true

  class << self
    def find_by_email(email)
      user = self.find_by(email: email)
      user.present?
    end
  end
end
