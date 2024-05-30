class Product < ApplicationRecord
  require_relative './collabs'
  require_relative './contents'

  belongs_to :user
  has_many :reviews
  validate :validate_collabs
  validate :validate_contents

  enum currency_code: {
    'USD': 0,
    'INR': 1
  }

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
      unless serializer.errors.count
        errors.add(:collabs, serializer.errors.messages)
        break
      end
    end
  end

  def validate_contents
    errors.add(:contents, 'There should be more than one page') and return if contents.length < 1

    contents.each do |content|
      serializer = Contents.new(content)
      unless serializer.errors.count
        errors.add(:contents, serializer.errors.messages)
        break
      end
    end
  end
end
