module Api
  class SessionsController < ApplicationController
    include CurrentUserConcern

    def create
      user = User.where(email: params[:email]).first!
      if user.provider == 'rails_login'
        if user and user.try(:authenticate, params[:password])
          session[:user_id] = user.id
          session[:expires_at] = Time.current + 7.days unless params[:remember]
          render json: {
            logged_in: true,
            name: user.name,
            email: user.email,
            user_id: user.id,
          }
        else
          render json: {
            error: 'Password is wrong'
          }, status: 401
        end
      else
        render json: {
          error: 'Email is registered with google'
        }
      end
    rescue StandardError
      render json: {
        error: 'Email not found'
      }, status: 404
    end

    def logged_in
      if @current_user
        render json: {
          logged_in: true,
          name: @current_user.name,
          email: @current_user.email,
          user_id: @current_user.id,
        }
      else
        reset_session
        render json: {
          logged_in: false
        }, status: 401
      end
    end

    def logout
      reset_session
      render json: {
        logged_in: false
      }
    end
  end
end
