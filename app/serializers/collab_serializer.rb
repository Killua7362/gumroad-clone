class CollabSerializer
  include JSONAPI::Serializer
  attributes :email, :share, :approved, :product_id
end
