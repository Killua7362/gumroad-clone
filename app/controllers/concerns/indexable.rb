module Indexable
  extend ActiveSupport::Concern

  included do
    def index_elasticsearch
      ActionCable.server.broadcast('async_query_channel', { indexed: false })
      ElasticsearchJob.perform_async(id)
      self
    end

    def destroy_index
      ActionCable.server.broadcast('async_query_channel', { indexed: false })
      ElasticsearchDestroyJob.perform_async(id)
      self
    end
  end
end
