class ProductSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :description, :summary, :price, :tags, :live, :collab_active, :thumbimageSource,
             :coverimageSource, :collabs, :contents

  has_many :reviews
end
