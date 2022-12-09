class ReCreatePerscriptionDrugs < ActiveRecord::Migration[7.0]
  def change
    create_table :perscription_drugs, primary_key: [:perscription_id, :drug_id] do |t|
      t.references :perscription,       null: false, foreign_key: true
      t.references :drug,               null: false, foreign_key: true
      t.text       :usage_description,  null: false
    end
  end
end
