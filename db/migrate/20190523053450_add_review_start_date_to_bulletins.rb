class AddReviewStartDateToBulletins < ActiveRecord::Migration[5.2]
  def change
    add_column :bulletins, :review_start_date, :date
  end
end
