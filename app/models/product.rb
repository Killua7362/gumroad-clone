class Product < ApplicationRecord
  require_relative './collabs.rb'

  belongs_to :user
  has_many :reviews
  serialize :collabs, coder: Collabs::ArraySerializer

  def can_go_live
    self[:collabs].map do |item|
      return false if item[:approved] == false
    end
    true
  end
end
