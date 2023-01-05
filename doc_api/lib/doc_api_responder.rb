module DocApiResponder
  protected

    def json_resource_errors
      {
        success: false,
        errors: DocApiErrorFormatter.call(resource.errors)
      }
    end
end