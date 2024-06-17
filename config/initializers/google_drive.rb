require 'googleauth'
require 'google/apis/drive_v3'

Rails.application.reloader.to_prepare do
  DRIVE = Google::Apis::DriveV3::DriveService.new
  DRIVE.authorization = Google::Auth::ServiceAccountCredentials.make_creds(scope: 'https://www.googleapis.com/auth/drive')

  module Drive
    def self.create_file; end

    def self.find_files(_file_name, folder_id)
      query = "name contains '#{_file_name}' and '#{folder_id}' in parents and trashed = false and mimeType contains 'image/'"
      DRIVE.list_files(
        q: query
      ).files[0]
    end
  end
end
