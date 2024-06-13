require 'rack/mime'
require 'google/apis/drive_v3'

module Api
  class ProductsController < ApplicationController
    include CurrentUserConcern

    def index
      if @current_user
        user = User.find_by(email: @current_user.email)
        products = Product.where(user_id: user.id)

        render json: ProductSerializer.new(products, options).serializable_hash.to_json
      else
        render json: { error: 'Not logged in' }, status: 401
      end
    end

    def create
      if @current_user
        product = Product.new(products_params.merge(user_id: @current_user.id))

        if product.save!
          render json: ProductSerializer.new(product, options).serializable_hash.to_json
        else
          render json: { error: product.errors.messages }, status: 401
        end
      else
        render json: { error: 'Not Authorized' }, status: 401
      end
    end

    def show
      product = Product.find_by(id: params[:id])
      if @current_user and @current_user.id == product.user_id
        render json: ProductSerializer.new(product, options).serializable_hash.to_json
      else
        render json: { error: 'Not Authorized' }, status: 401
      end
    end

    def update
      Product.transaction(joinable: false) do
        product = Product.find_by(id: params[:id])
        if @current_user and @current_user.id == product.user_id

          if params[:live] == true and !product.can_go_live
            render json: { error: 'Cannot go live because collaborators are yet to approve' }, status: 404 and return
          end

          thumbLink = uploadImage('thumbimageSource', "#{product.user_id}_#{product.id}_thumbnail")
          coverLink = uploadImage('coverimageSource', "#{product.user_id}_#{product.id}_cover")

          if product.update(products_params.merge(user_id: @current_user.id, thumbimageSource: thumbLink, coverimageSource: coverLink,
                                                  live: params['product'].keys == ['live'] ? params[:live] : false))
            render json: ProductSerializer.new(product, options).serializable_hash.to_json
          else
            render json: { error: product.errors.messages }, status: 401
          end
        else
          render json: { error: 'Not Authorized' }, status: 401
        end
      end
    end

    def destroy
      product = Product.find_by(id: params[:id])
      if @current_user and @current_user.id == product.user_id
        if product.destroy
          head :no_content
        else
          render json: { error: product.errors.messages }, status: 401
        end
      else
        render json: { error: 'Not Authorized' }, status: 401
      end
    end

    private

    def products_params
      params.require(:product).permit(:title, :description, :summary, :price, :currency_code, :tags, :live, :collab_active,
                                      :thumbimageSource, :coverimageSource, collabs: %i[email share approved], contents: %i[name content])
    end

    def options
      @options ||= { include: %i[reviews] }
    end

    def getExtension(_base64string)
      signs = { "/9j/": 'image/jpeg', "iVBORw0KGgo": 'image/png' }
      for s in signs.keys do
        return Rack::Mime::MIME_TYPES.invert[signs[s]], signs[s] if _base64string.include? s.to_s
      end
    end

    def isBase64(base64string)
      pattern = Regexp.new('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$')
      base64string.is_a?(String) && pattern.match?(base64string.split(',')[1])
    end

    def base64ToImg(base64string, _filename, extension)
      file = Tempfile.new([_filename, extension])
      file.binmode
      file.write Base64.decode64(base64string.split(',')[1])
      file.rewind
      file
    end

    def uploadImage(key, filename)
      return params[key] unless params.has_key?(key) and isBase64(params[key].to_s)

      extension, type = getExtension(params[key])
      image = base64ToImg(params[key], filename, extension)

      imageExist = Drive.find_files(filename)
      if imageExist.nil?
        file = Google::Apis::DriveV3::File.new(name: "#{filename}#{extension}", parents: [ENV.fetch('PARENT_DRIVE_ID')],
                                               mimeType: type)
        drive_file = DRIVE.create_file(file, upload_source: image.path, content_type: type)
      else
        file = Google::Apis::DriveV3::File.new(name: "#{filename}#{extension}",
                                               mimeType: type)
        drive_file = DRIVE.update_file(imageExist.id, file, upload_source: image.path)
      end
      "https://drive.google.com/thumbnail?id=#{drive_file.id}"
    end
  end
end
