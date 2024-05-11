class ProductSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :description, :summary, :price, :type, :live, :collab_active, :thumbimageSource, :coverimageSource, :collabs

  has_many :reviews
end
