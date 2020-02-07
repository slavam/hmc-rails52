class CreateUnionForecasts < ActiveRecord::Migration[5.2]
  def change
    create_table :union_forecasts do |t|
      t.date :report_date
      t.string :curr_number
      t.text :synoptic_situation
      t.text :forecast_north
      t.string :north1_tn
      t.string :north1_td
      t.string :north2_tn
      t.string :north2_td
      t.string :north3_tn
      t.string :north3_td
      t.text :forecast_west
      t.string :west1_tn
      t.string :west1_td
      t.string :west2_tn
      t.string :west2_td
      t.string :west3_tn
      t.string :west3_td
      t.text :forecast_south
      t.string :south1_tn
      t.string :south1_td
      t.string :south2_tn
      t.string :south2_td
      t.string :south3_tn
      t.string :south3_td
      t.text :forecast_east
      t.string :east1_tn
      t.string :east1_td
      t.string :east2_tn
      t.string :east2_td
      t.string :east3_tn
      t.string :east3_td
      t.text :forecast_capital
      t.string :capital_tn
      t.string :capital_td
      t.string :capital_pd
      t.string :capital_pn
      t.string :capital_humidity
      t.string :chief
      t.string :synoptic
      t.timestamps
    end
  end
end
