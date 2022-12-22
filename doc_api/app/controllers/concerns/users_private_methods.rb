module UsersPrivateMethods
  extend ActiveSupport::Concern
  
  private
  
    # Override
    def set_flash_message(key, kind, options = {})
      message = find_message(kind, options)
    end

    # Override
    def successfully_sent?(resource)
      notice = if Devise.paranoid
        resource.errors.clear
        :send_paranoid_instructions
      elsif resource.errors.empty?
        :send_instructions
      end

      if notice
        [true, notice]
      end
    end

end