class CreatePrescriptions < ActiveRecord::Migration[7.0]
  def change
    create_table :perscriptions do |t|
      t.references :examination, null: false, foreign_key: true, index: true
      t.text       :description, null: true
      t.timestamps
    end
  end
end
