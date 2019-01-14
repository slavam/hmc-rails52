# ул.+Любавина,+2,+Донецк,+Донецкая+область,+83000/@48.0161457,37.8057165
module StationsHelper
  def google_map(center)
    "https://maps.googleapis.com/maps/api/staticmap?center=#{center}&size=300x300&zoom=17"
  end
end