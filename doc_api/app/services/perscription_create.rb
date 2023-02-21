class PerscriptionCreate < ApplicationService
  def initialize(examination_id, description)
    @examination_id = examination_id
    @description = description
  end

  def call
    perscription = new_perscription
    status = perscription.save
    [status, perscription]
  end

  private
    def new_perscription
      Perscription.new(examination_id: @examination_id, description: @description)
    end
end
