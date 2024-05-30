class Category
  include ActiveModel::Model
  include ActiveModel::Validations

  attr_accessor :name, :hidden, :url

  validates :name, presence: true
  validates :url, presence: true
  validates :hidden, inclusion: [true, false], exclusion: [nil]
end
