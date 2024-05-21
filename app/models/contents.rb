class Contents
  include ActiveModel::Model
  include ActiveModel::Validations

  attr_accessor :name, :content

  validates :name, presence: true
  validates :content, presence: true
end
