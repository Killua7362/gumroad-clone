class ProductSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :description, :summary, :price, :type, :live, :collab_active, :thumbimageSource, :coverimageSource

  has_many :reviews
  has_many :collabs
end
