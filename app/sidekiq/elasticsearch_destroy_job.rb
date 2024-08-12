class ElasticsearchDestroyJob
  include Sidekiq::Job

  def perform(id)
    object = Product.new
    object.id = id
    Product.search_index.remove(object)

    loop do
      break if Searchkick.reindex_status('products_development')[:completed]

      sleep 3
    end

    Product.searchkick_index.refresh
    ActionCable.server.broadcast('async_query_channel', { indexed: true })
  end
end
