class Collabs
  include ActiveModel::Model
  include ActiveModel::Validations

  attr_accessor :email, :share, :approved

  validates :email, presence: true
  validates :share, presence: true, numericality: { only_integer: true }
  validates :approved, inclusion: [true, false], exclusion: [nil]
end
