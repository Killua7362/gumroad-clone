module Api
  class RegistrationsController < ApplicationController
    def create
      check_user = User.find_by(email: params[:email])
      if check_user
        if check_user.provider == 'google'
          render json:{
            error: 'Email is already signed up using google'
          }, status: 500
        else
          render json:{
            error: 'Email already exists, use signin instead'
          }, status: 500
        end
      else
        user = User.create(users_params)

        if user and user.errors.messages.empty?
          head :no_content
        else
          render json:{
            error: "Error occured"
          }, status: 500
        end
      end
    end
  
    private

    def users_params
      params.require(:user).permit(:name,:email,:password,:password_confirmation)
    end

  end
end
