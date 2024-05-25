module Api
  class ProfilesController < ApplicationController
    include CurrentUserConcern

    def index
      products = Product.where(user_id: params[:id], live: true)
      render json: ProductSerializer.new(products, options).serializable_hash.to_json
    rescue StandardError
      render json: { error: 'Profile does not exist' }, status: 404
    end

    def index_profile
      profile = Profile.find_by(user_id: params[:id])
      if profile
        render json: ProfilesSerializer.new(profile).serializable_hash.to_json
      else
        render json: { error: 'Profile does not exist' }, status: 404
      end
    end

    def show
      product = Product.find_by(user_id: params[:id], id: params[:productid], live: true)
      if product
        render json: ProductSerializer.new(product, options).serializable_hash.to_json
      else
        render json: { error: 'Product does not exist' }, status: 404
      end
    end

    def update
      if @current_user and params[:id] == @current_user.id.to_s
        profile = Profile.find_by(user_id: @current_user.id)
        puts profile_params
        if profile.update(profile_params)
          render json: ProfilesSerializer.new(profile).serializable_hash.to_json
        else
          render json: {
            error: profile.errors.messages
          }, status: 404
        end
      else
        render json: {
          error: 'Unauthorized'
        }, status: 401
      end
    end

    private

    def options
      @options ||= { include: %i[reviews] }
    end

    def profile_params
      params.require(:profile).permit(:name, :bio, category: %i[name hidden url])
    end
  end
end
