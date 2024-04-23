class CollabSerializer
  include JSONAPI::Serializer
  attributes :email, :share, :approved
end
