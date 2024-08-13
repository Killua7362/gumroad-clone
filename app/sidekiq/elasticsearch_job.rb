class ElasticsearchJob
  include Sidekiq::Job
  sidekiq_options retry: 0

  def perform(id)
    object = Product.find_by(id: id.to_s)
    object.reindex

    loop do
      break if Searchkick.reindex_status('products_development')[:completed]

      sleep 5
    end

    Product.searchkick_index.refresh
    ActionCable.server.broadcast('async_query_channel', { indexed: true })
  end
end