class ElasticsearchJob
  include Sidekiq::Job

  def perform(classu, id)
    object = classu.constantize.find(id.to_s)
    object.reindex
  rescue StandardError => e
    puts "Error while indexing: #{e}"
  end
end
