class CreateExaminations < ActiveRecord::Migration[7.0]
  def change
    create_table :examinations do |t|
      t.references :user, null: false, foreign_key: true, index: true
      t.column     :weight_kg, "double", null: false
      t.column     :height_cm, "double", null: false
      t.text       :anamnesis, null: false
      t.timestamps null: false
    end
  end
end
