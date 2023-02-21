class ExaminationCreator < ApplicationService
  def initialize(user_id, weight, height, anamnesis, attach_perscription, perscription_descr, perscription_drugs)
    @user_id   = user_id
    @weight    = weight
    @height    = height
    @anamnesis = anamnesis
    @attach_perscription = attach_perscription
    @perscription_descr = perscription_descr
    @perscription_drugs = perscription_drugs
  end

  def call
    examination = new_examination
    return [false, [examination.errors.full_messages]] unless examination.save

    if @attach_perscription == "on"
      status, perscription_or_errors = PerscriptionCreator.call(examination.id, @perscription_descr,
                                                                @perscription_drugs)
      return [false, perscription_or_errors] unless status == true
    end
    [true, examination]
  end

  private
    def new_examination
      Examination.new(
        user_id:   @user_id,
        weight_kg: @weight,
        height_cm: @height,
        anamnesis: @anamnesis
      )
    end
end
