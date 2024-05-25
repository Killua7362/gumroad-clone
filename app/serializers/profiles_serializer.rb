class ProfilesSerializer
  include JSONAPI::Serializer
  attributes :name, :bio, :category
end
