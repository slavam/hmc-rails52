module RadiationObservationsHelper
  def menu_builder(page_id)
    ["home", "store", "faq"].map { |tab| 
      %{<li class="#{page_id == tab ? "active" : "inactive"}"><a href="#{tab}">#{tab.capitalize}</a></li>}  
    }.join("\n")
  end
end
