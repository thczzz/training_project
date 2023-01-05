class AddInitialCreateColumnToTokensTable < ActiveRecord::Migration[7.0]
  def change
    add_column :oauth_access_tokens, :initial_create, :datetime, null: true
  end
end
