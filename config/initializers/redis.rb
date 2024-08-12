require 'redis'

Rails.application.reloader.to_prepare do
  REDIS = Redis.new(url: ENV.fetch('REDIS_URL'))
end

