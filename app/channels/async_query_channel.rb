class AsyncQueryChannel < ApplicationCable::Channel
  def subscribed
    # reject unless params[:user_id] == current_user.id
    stream_from 'async_query_channel'
    # ActionCable.server.brodcast 'async_query_channel', 'Backend is working now'
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
