class PerscriptionDrugsCreator < ApplicationService
  def initialize(perscription_id, perscription_drugs)
    @perscription_id = perscription_id
    @perscription_drugs = perscription_drugs
  end

  def call
    if @perscription_drugs.blank? || @perscription_drugs[0].empty?
      return [false, ["Perscription Drugs cannot be empty!"]]
    end

    @perscription_drugs.each do |persc_drug|
      new_persc_drug = new_perscription_drug(persc_drug["id"], persc_drug["description"])
      return [false, [new_persc_drug.errors.full_messages]] unless new_persc_drug.save
    end
    [true, []]
  end

  private
    def new_perscription_drug(drug_id, usage_description)
      PerscriptionDrug.new(perscription_id: @perscription_id, drug_id:, usage_description:)
    end
end
