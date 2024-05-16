class Product < ApplicationRecord
  require_relative './collabs'

  belongs_to :user
  has_many :reviews
  validate :validate_collabs

  def can_go_live
    self[:collabs].map do |item|
      return false if item['approved'] == false
    end
    true
  end

  private

  def validate_collabs
    collabs.each do |collab|
      serializer = Collabs.new(collab)
      unless serializer.valid?
        errors.add(:collabs, 'Schema is bad')
        break
      end
    end
  end
end
