module Api
  class CollabsController < ApplicationController
    include CurrentUserConcern

    def validate_user
      if @current_user
        valid = true
        result = params[:collabs].map do |mail|
          if @current_user.email == mail
            valid = false
            "Current user's email is not usable"
          elsif !User.find_by_email(mail)
            valid = false
            'This user does not exist'
          end
        end
        render json: { valid:, data: result }
      else
        render json: { error: 'Not authorized' }, status: 401
      end
    end

    def index
      if @current_user
        products = Product.where('collabs @> ARRAY[?]::jsonb[]', [{ 'email': @current_user.email }].to_json)
        render json: ProductSerializer.new(products, options).serializable_hash.to_json
      else
        render json: { error: 'Not logged in' }, status: 401
      end
    end

    def approve
      product = Product.find_by(id: params[:id])
      if @current_user && product.present?
        collab = product.collabs.select { |c| c['email'] == @current_user.email }.first
        if collab
          collab['approved'] = !collab['approved']
          if product.save
            render json: ProductSerializer.new(product, options).serializable_hash.to_json
          else
            render json: { error: product.errors.messages }, status: 401
          end
        else
          render json: { error: 'Collaborator not found' }, status: 404
        end
      else
        render json: { error: 'Not logged in' }, status: 401
      end
    end

    def options
      @options ||= { include: %i[reviews] }
    end
  end
end
