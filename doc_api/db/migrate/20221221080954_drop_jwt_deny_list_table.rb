class DropJwtDenyListTable < ActiveRecord::Migration[7.0]
  def up
    drop_table :jwt_denylist
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
