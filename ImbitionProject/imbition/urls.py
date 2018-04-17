from django.conf.urls import url
from imbition import views

urlpatterns = [
    url('', views.index, name="index"),
    url(r'^.*/$', views.index)
]
