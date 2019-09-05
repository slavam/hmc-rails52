module MeteoLinksHelper
  def active_meteo_links
    @active_meteo_links = MeteoLink.where("is_active = true").order(:name)
  end
  def user_menu_names
    sql = "select um.name, um.id from user_menus um where um.id in (select distinct(user_menu_id) from meteo_links where user_id=#{current_user.id});"
    res = MeteoLink.find_by_sql(sql)
  end
  def dynamic_meteo_links(user_menu_id)
    MeteoLink.where("is_active=true AND user_id=#{current_user.id} AND user_menu_id=#{user_menu_id}").order(:id)
  end
end