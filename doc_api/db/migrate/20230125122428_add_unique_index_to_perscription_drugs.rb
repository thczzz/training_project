class AddUniqueIndexToPerscriptionDrugs < ActiveRecord::Migration[7.0]
  def change
    add_index :perscription_drugs, [:perscription_id, :drug_id], :unique => true
  end
end
