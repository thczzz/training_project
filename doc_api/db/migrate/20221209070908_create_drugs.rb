class CreateDrugs < ActiveRecord::Migration[7.0]
  def change
    create_table :drugs do |t|
      t.string :name,        null: false
      t.text   :description, null: false
      t.timestamps           null: false
    end
  end
end
