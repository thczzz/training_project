class DropPerscriptionDrugs < ActiveRecord::Migration[7.0]
  def up
    drop_table :perscription_drugs
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
