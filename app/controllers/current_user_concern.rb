module CurrentUserConcern
  extend ActiveSupport::Concern

  included do
    before_action :set_current_user
  end

  def set_current_user
    if session[:user_id] and (!session[:expires_at] || session[:expires_at] >= Time.current )
      @current_user = User.find(session[:user_id])
    end
  end
end
