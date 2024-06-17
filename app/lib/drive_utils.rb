class DriveUtils
  class << self
    def create_folder(_file_name, _folder_id = ENV.fetch('PARENT_DRIVE_ID'))
      file = {
        'name': _file_name,
        'parents': [_folder_id],
        'mime_type': 'application/vnd.google-apps.folder'
      }
      DRIVE.create_file(file, content_type: 'application/vnd.google-apps.folder') do |res, err|
        raise err if err

        return res.id
      end
    end
  end
end
