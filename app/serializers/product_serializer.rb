class ProductSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :description, :summary, :price, :tags, :live, :collab_active, :thumbimageSource,
             :coverimageSource, :collabs, :contents, :currency_code, :created_at, :updated_at, :user_id

  has_many :reviews
end
