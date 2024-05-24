module Api
  class RegistrationsController < ApplicationController
    def create
      check_user = User.find_by(email: params[:email])
      if check_user
        if check_user.provider == 'google'
          render json: {
            error: 'Email is already signed up using google'
          }, status: 500
        else
          render json: {
            error: 'Email already exists, use signin instead'
          }, status: 500
        end
      else
        begin
          user = User.create!(users_params)
          profile = Profile.create!(name: user.name, bio: '', category: [], user_id: user.id)
          head :no_content
        rescue StandardError => e
          render json: {
            error: e
          }, status: 500
        end

      end
    end

    private

    def users_params
      params.require(:registration).permit(:name, :email, :password, :password_confirmation)
    end
  end
end
