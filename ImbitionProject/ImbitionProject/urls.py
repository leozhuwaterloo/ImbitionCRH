"""ImbitionProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework import routers
from rest_framework.schemas import get_schema_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from imbition import views as imbition_views
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'api/imbition/employee', imbition_views.EmployeeViewSet)
router.register(r'api/imbition/permission', imbition_views.PermissionViewSet)
router.register(r'api/imbition/position', imbition_views.PositionViewSet)
router.register(r'api/imbition/department', imbition_views.DepartmentViewSet)
router.register(r'api/imbition/recordfield', imbition_views.RecordFieldViewSet)

router.register(r'api/imbition/positionpermission', imbition_views.PositionPermissionViewSet)
router.register(r'api/imbition/positionrecord', imbition_views.PositionRecordFieldViewSet)
router.register(r'api/imbition/employeerecord', imbition_views.EmployeeRecordViewSet)
router.register(r'api/imbition/user', imbition_views.UserDetailViewSet)
router.register(r'api/imbition/positiontree', imbition_views.PositionTreeViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', RedirectView.as_view(pattern_name='index', permanent=False)),
    path('imbition/', include('imbition.urls')),
    path('api/', get_schema_view()),
    path('api/auth/', include(
        'rest_framework.urls', namespace='rest_framework')),
    path('api/auth/token/obtain/', TokenObtainPairView.as_view()),
    path('api/auth/token/refresh/', TokenRefreshView.as_view()),
] + router.urls + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
