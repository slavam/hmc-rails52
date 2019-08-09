class CreateBulletinEditors < ActiveRecord::Migration[5.2]
  def change
    create_table :bulletin_editors do |t|
      t.integer :user_id, null: false
      t.integer :bulletin_id, null: false

      t.timestamps
    end
  end
end
