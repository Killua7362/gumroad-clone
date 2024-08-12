module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      set_current_user
      if @current_user
        self.current_user = @current_user
      else
        reject_unauthorized_connection
      end
    end

    private

    def set_current_user
      session = request.session
      return unless session[:user_id] && (!session[:expires_at] || session[:expires_at] >= Time.current)

      @current_user = User.find_by(id: session[:user_id])
    end
  end
end
