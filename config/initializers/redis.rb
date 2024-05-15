require 'redis'

Rails.application.reloader.to_prepare do
  redis = ENV.fetch('REDIS_URL')
  REDIS = Redis.new(url: redis)
end
