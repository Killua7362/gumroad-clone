module Api
  require 'google/apis/drive_v3'
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
        drive_file = nil
        begin
          drive_file = DriveUtils.create_folder(params[:email])
          user = User.create!(users_params.merge(folder_id: drive_file))
          profile = Profile.create!(name: user.name, bio: '', category: [], user_id: user.id)
          head :no_content
        rescue StandardError => e
          DRIVE.delete_file(drive_file) unless drive_file.nil?
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
