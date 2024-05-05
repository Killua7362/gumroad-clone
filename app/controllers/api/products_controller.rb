module Api
  class ProductsController < ApplicationController
    include CurrentUserConcern
    
    def index
      if @current_user
        user = User.find_by(email: @current_user.email)
        products = Product.where(:user_id => user.id)

        render json: ProductSerializer.new(products,options).serializable_hash.to_json
      else
        render json: {error: "Not logged in"}, status: 401
      end
    end

    def index_profile
        begin
          user = User.find_by(id: params[:id])
          products = Product.where(:user_id => params[:id])
          render json: ProductSerializer.new(products,options).serializable_hash.to_json
        rescue
          render json: {error: "Profile does not exist"}, status: 401
        end
    end


    def show
      product = Product.find_by(id: params[:id])

      render json: ProductSerializer.new(product,options).serializable_hash.to_json
    end

    def create
      if @current_user 
        product = Product.new(products_params.merge(:user_id => @current_user.id))

        if product.save!
          render json: ProductSerializer.new(product,options).serializable_hash.to_json
        else
          render json: {error: product.errors.messages }, status: 401
        end
      else
        render json: {error: "Not Authorized"}, status: 401
      end
    end

    def update
      Product.transaction(joinable:false) do 
        product = Product.find_by(id: params[:id])
        if @current_user and @current_user.id == product.user_id
          if product.update(products_params.merge(:user_id => @current_user.id))
            if params.has_key?(:collab)
              # params.dig(:collab)&.each { |collab| collab[:product_id] = product.id }
              Collab.transaction(requires_new: true, joinable: false) do 
      
                params.to_unsafe_h[:collab].each do |q|
                  if not User.find_by_email(q[:email]) or @current_user.email == q[:email]
                    raise ActiveRecord::Rollback 
                    render json: {error: 'One of the user does not exist or using current users mail'} and return
                  end
                  collab = Collab.find_by(email: q[:email],product_id: product.id)
                  if collab.present?
                    collab.update(q)
                  else
                    Collab.create!(q.merge(:product_id => product.id))
                  end
                end

                collabs = Collab.where(product_id: product.id).each do |q|
                  collab = params.to_unsafe_h[:collab].find { |n| q.email == n[:email] }
                  if not collab.present?
                    q.destroy()
                  end
                end

              rescue => error 
                raise ActiveRecord::Rollback 
                render json: {error: error}, status: 404 and return
              end

            end
            render json: ProductSerializer.new(product,options).serializable_hash.to_json
          else
            render json: {error: product.errors.messages }, status: 401
          end
        else
          render json: {error: "Not Authorized"}, status: 401
        end
      end
    end

    def destroy
      product = Product.find_by(id: params[:id])
      if @current_user and @current_user.id == product.user_id
        if product.destroy
          head :no_content
        else
          render json: {error: product.errors.messages}, status: 401
        end
      else
        render json: {error: "Not Authorized"}, status: 401
      end
    end

    private

    def products_params
      params.require(:product).permit(:title, :description, :summary, :price, :type, :live, :collab_active, :thumbimageSource, :coverimageSource)
    end

    def options
      @options ||= {include: %i[reviews collabs]}
    end

  end
end
