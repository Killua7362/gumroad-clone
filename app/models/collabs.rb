class Collabs
  include ActiveModel::Model
  attr_accessor :email, :share, :approved

  validates :email, presence: true
  validates :share, presence: true, numericality: { only_integer: true }
  validates :approved, inclusion: { in: [true, false] }

  def initialize(attrs)
    attrs.each do |attr, value|
      send("#{attr}=", value)
    end
  end

  def attributes
    %i[email share approved].each_with_object({}) do |attr, hash|
      hash[attr] = send(attr)
    end
  end

  class ArraySerializer
    class << self
      def load(arr)
        (arr || []).map do |item|
          Collabs.new(item)
        end
      end

      def dump(arr)
        arr.map { |item| item.respond_to?(:attributes) ? item.attributes : item }
      end
    end
  end
end
