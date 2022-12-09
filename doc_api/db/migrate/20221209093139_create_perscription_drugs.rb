class CreatePerscriptionDrugs < ActiveRecord::Migration[7.0]
  def change
    create_table :perscription_drugs, id: false do |t|
      t.references :perscription,       null: false, foreign_key: true
      t.references :drug,               null: false, foreign_key: true
      t.text       :usage_description,  null: false
    end

    add_index :perscription_drugs, [:perscription_id, :drug_id], :unique => true
  end
end
