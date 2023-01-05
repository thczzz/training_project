class ChangeTokenColumnOnDoorkeeperToText < ActiveRecord::Migration[7.0]
  def change
    remove_index  :oauth_access_tokens, :token
    change_column :oauth_access_tokens, :token, :text
  end
end
