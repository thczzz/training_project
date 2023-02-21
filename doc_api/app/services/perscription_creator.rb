class PerscriptionCreator < ApplicationService
  def initialize(examination_id, perscription_descr, perscription_drugs)
    @examination_id = examination_id
    @perscription_descr = perscription_descr
    @perscription_drugs = perscription_drugs
  end

  def call
    status, perscription = PerscriptionCreate.call(@examination_id, @perscription_descr)
    return [false, [perscription.errors.full_messages]] unless status == true

    status, errors = PerscriptionDrugsCreator.call(perscription.id, @perscription_drugs)
    return [false, errors] unless status == true

    [true, perscription]
  end
end
