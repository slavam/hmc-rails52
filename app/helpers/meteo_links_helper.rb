module MeteoLinksHelper
  def active_meteo_links
    @active_meteo_links = MeteoLink.where("is_active = true").order(:name)
  end
  # def guest_resources
  #   UserMenuName.where(:is_active, true).order(:id)
  # end
end