module Searchable
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    mapping do
      indexes :title, type: 'text'
      indexes :description, type: 'text'
      indexes :summary, type: 'text'
    end

    def self.search(query)
      params = {
        query: {
          multi_match: {
            query:,
            fields: %w[title description summary],
            fuzziness: 'AUTO'
          }
        }
      }
      __elasticsearch__.search(params).records.to_a
    end
  end
end
