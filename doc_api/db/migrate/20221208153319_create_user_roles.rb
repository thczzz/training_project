class CreateUserRoles < ActiveRecord::Migration[7.0]
  def change
    create_table :roles do |t|
      t.string :name,        null: false
      t.text   :description, null: false
      t.timestamps           null: false
    end
  end
end
