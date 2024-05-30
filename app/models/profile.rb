class Profile < ApplicationRecord
  require_relative './contents'

  belongs_to :user
  validate :validate_profile
  after_initialize :init

  private

  def validate_profile
    category.each do |cat|
      serializer = Category.new(cat)
      unless serializer.errors.count
        errors.add(:category, serializer.errors.messages)
        break
      end
    end
  end

  def init
    category.each do |cat|
      cat['url'] = 'reverse=false&sort_by=title&edit_url=false&product_all=true&product_count=2' if cat['url'] == ''
    end
  end
end
